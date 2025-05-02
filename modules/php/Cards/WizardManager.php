<?php

namespace Bga\Games\WanderingTowers\Cards;

use Bga\Games\WanderingTowers\Notifications\NotifManager;

class WizardManager extends CardManager
{
    public function __construct(\Table $game)
    {
        parent::__construct($game, $game->wizard_cards, "wizard");
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

        if ($this->countOnSpace($space_id) < $setupWizardCount) {
            if ($this->countCards("hand", $player_id) > 0) {
                $this->transferCard("hand", "space", $player_id, $space_id);
            }

            $player_id = $this->game->getPlayerAfter($player_id);
        } else {
            $space_id++;
        }

        $this->setupOnTowers($player_id, $space_id);
    }

    public function countOnSpace(int $tower_id): int
    {
        return $this->countCards("space", $tower_id);
    }

    public function getSpaceId(int $wizardCard_id): int
    {
        $wizardCard = (array) $this->getCard($wizardCard_id);
        return $wizardCard["location_arg"];
    }

    public function moveBySteps(int $wizardCard_id, int $steps): void
    {
        $space_id = $this->getSpaceId($wizardCard_id);
        $space_id = $space_id = $steps;

        $this->moveLocationArg($wizardCard_id, $space_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveWizard",
            clienttranslate('${player_name} moves a wizard by ${steps_label} spaces'),
            [
                "steps" => $steps,
                "steps_label" => $steps
            ]
        );
    }

    public function validateOwner(int $wizardCard_id, int $player_id): void
    {
        $wizardCard = $this->getCard($wizardCard_id);

        if ((int) $wizardCard["type_arg"] !== $player_id) {
            throw new \BgaVisibleSystemException("Invalid wizard owner");
        }
    }
}
