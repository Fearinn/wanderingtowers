<?php

namespace Bga\Games\WanderingTowers\components\Wizard;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\components\CardManager;

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

        $firstPlayer_id = (int) $this->game->getNextPlayerTable()[0];
        $this->setupOnTowers($firstPlayer_id);
    }

    private function setupOnTowers(int $player_id, int $space_id = 2): void
    {
        $space = (array) $this->game->SPACES[$space_id];
        $setupWizardCount = (int) $space["setupWizardCount"];

        if ($setupWizardCount === 0 || $this->countCardsInHand(null) === 0) {
            return;
        }

        if ($this->countOnSpace($space_id) < $setupWizardCount) {
            if ($this->countCardsInHand($player_id) > 0) {
                $this->transferCard("hand", "space", $player_id, $space_id);
            }

            $player_id = $this->game->getPlayerAfter($player_id);
        } else {
            $space_id++;
        }

        $this->setupOnTowers($player_id, $space_id);
    }

    public function countOnSpace(int $space_id): int
    {
        return $this->countCardsInLocation("space", $space_id);
    }
}
