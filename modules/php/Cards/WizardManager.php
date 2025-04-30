<?php

namespace Bga\Games\WanderingTowers\Cards;

class WizardManager extends CardManager
{
    public function __construct(\Table $game)
    {
        parent::__construct($game);
        $this->deck = $this->game->wizard_cards;
        $this->database = "wizard";
    }

    public function setupCards(): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $playerNbr = count($players);

        $setupCounts = (array) $this->game->SETUP_COUNTS[$playerNbr];
        $wizardCount = (int) $setupCounts["wizards"];

        $wizardCards = [];
        foreach ($players as $player_id => $player) {
            $wizardCards[] = ["type" => $player["player_color"], "type_arg" => $player_id, "nbr" => $wizardCount];
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

        if ($setupWizardCount === 0 || $this->countCards("hand") === 0) {
            return;
        }

        if ($this->countOnTower($space_id) < $setupWizardCount) {
            if ($this->countCards("hand", $player_id) > 0) {
                $this->transferCard("hand", "tower", $player_id, $space_id);
            }

            $player_id = $this->game->getPlayerAfter($player_id);
        } else {
            $space_id++;
        }

        $this->setupOnTowers($player_id, $space_id);
    }

    public function countOnTower(int $tower_id): int
    {
        return $this->countCards("tower", $tower_id);
    }
}
