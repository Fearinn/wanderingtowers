<?php

namespace Bga\Games\WanderingTowers\Components\Wizard;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class WizardManager extends CardManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game, $game->wizard_cards, "wizard");
        $this->fields .= ", tier";
    }

    public function setupCards(): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $playerNbr = count($players);

        $setupCounts = (array) $this->game->SETUP_COUNTS[$playerNbr];
        $wizardCount = (int) $setupCounts["wizards"];

        $gameinfos = $this->game->getGameinfos();
        $colors = $gameinfos["player_colors"];

        $wizardCards = [];
        foreach ($players as $player_id => $player) {
            $color = $player["player_color"];
            $k_color = array_search($color, $colors);
            $wizardCards[] = ["type" => $k_color, "type_arg" => $player_id, "nbr" => $wizardCount];
        }
        $this->createCards($wizardCards);

        foreach ($players as $player_id => $player) {
            $this->game->DbQuery("UPDATE wizard SET card_location='hand', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
        }

        $nextPlayerTable = (array) $this->game->getNextPlayerTable();
        $firstPlayer_id = (int) $nextPlayerTable[0];
        $this->setupOnTowers($firstPlayer_id);
    }

    public function setupOnTowers(int $player_id, int $space_id = 2): void
    {
        $space = (array) $this->game->SPACES[$space_id];
        $setupWizardCount = (int) $space["setupWizardCount"];

        if ($setupWizardCount === 0 || $this->countCardsInHand(null) === 0) {
            return;
        }

        if ($this->countCardsInHand($player_id) > 0) {
            if (
                $this->countOnSpace($space_id) < $setupWizardCount
            ) {
                $this->transferCard("hand", "space", $player_id, $space_id);
                $player_id = $this->game->getPlayerAfter($player_id);
            } else {
                $space_id++;
            }
        } else {
            $player_id = $this->game->getPlayerAfter($player_id);
        }

        $this->setupOnTowers($player_id, $space_id);
    }

    public function countOnSpace(int $space_id): int
    {
        return (int) $this->countCardsInLocation("space", $space_id);
    }


    public function getByTier(int $space_id, int $tier): array
    {
        $cards = $this->getCardsInLocation("space", $space_id);

        $cards = array_filter(
            $cards,
            function ($card) use ($tier) {
                $card_id = (int) $card["id"];
                $Wizard = new Wizard($this->game, $card_id);
                return $tier === $Wizard->tier;
            }
        );

        return $cards;
    }

    public function moveWizardsWithTower(int $space_id, int $tier, int $towerCard_id): void
    {
        $wizardCards = $this->getByTier($space_id, $tier);

        foreach ($wizardCards as $wizardCard) {
            $wizardCard_id = (int) $wizardCard["id"];
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $Wizard->moveWithTower($towerCard_id);
        }
    }

    public function imprisonWizards(int $space_id, int $tier, int $player_id): void
    {
        $wizardCards = $this->getByTier($space_id, $tier);

        $imprisioned = false;
        foreach ($wizardCards as $wizardCard) {
            $wizardCard_id = (int) $wizardCard["id"];
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $Wizard->imprison();
            $imprisioned = true;
        }

        if ($imprisioned) {

            $NotifManager = new NotifManager($this->game);
            $NotifManager->all(
                "imprisonWizards",
                clienttranslate('${player_name} imprisons wizard(s)'),
            );

            $PotionManager = new PotionManager($this->game);
            $PotionManager->fillPotion($player_id);
        }
    }

    public function freeUpWizards(int $space_id, int $tier): void
    {
        $wizardCards = $this->getByTier($space_id, $tier);

        foreach ($wizardCards as $wizardCard) {
            $wizardCard_id = (int) $wizardCard["id"];
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $Wizard->freeUp();
        }
    }
}
