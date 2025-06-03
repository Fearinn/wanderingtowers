<?php

namespace Bga\Games\WanderingTowers\Components\Wizard;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use BgaUserException;

use const Bga\Games\WanderingTowers\G_ROLL;

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
                $this->countOnSpace($space_id, 1) < $setupWizardCount
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

    public function countOnSpace(int $space_id, int $tier): int
    {
        $count = (int) $this->game->getUniqueValueFromDB("SELECT COUNT(card_id) FROM {$this->dbTable} WHERE card_location_arg={$space_id} AND tier={$tier}");
        return $count;
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

    public function getByOwner(int $player_id, bool $visibleOnly): array
    {
        $wizardCards = $this->getCardsByTypeArg($player_id);
        $TowerManager = new TowerManager($this->game);

        if ($visibleOnly) {
            array_filter($wizardCards, function ($wizardCard_id) use ($TowerManager) {
                $Wizard = new Wizard($this->game, $wizardCard_id);
                $space_id = $Wizard->getSpaceId();

                return $Wizard->tier === $TowerManager->countOnSpace($space_id);
            }, ARRAY_FILTER_USE_KEY);
        }

        return $wizardCards;
    }

    public function getMovable(int $moveCard_id, int $player_id): array
    {
        $Move = new Move($this->game, $moveCard_id);

        if ($Move->type !== "wizard" && $Move->type !== "both") {
            return [];
        }

        $movableCards = $this->getByOwner($player_id, true);

        if ($Move->isDice()) {
            if ($this->game->gamestate->state_id() === ST_AFTER_ROLL) {
                return $movableCards;
            }
            $steps = $this->game->globals->get(G_ROLL);
        } else {
            $steps = $Move->getSteps("wizard");
        }

        $movableCards = array_filter($movableCards, function ($wizardCard_id)  use ($steps) {
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $space_id = $Wizard->getSpaceId() + $steps;

            return $this->countOnSpace($space_id, $Wizard->tier) < 6;
        }, ARRAY_FILTER_USE_KEY);

        return array_values($movableCards);
    }
}
