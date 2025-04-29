<?php

namespace Bga\Games\WanderingTowers;

class WizardManager extends CardManager
{
    public function __construct(\Table $game)
    {
        parent::__construct($game);
        $this->deck = $this->game->wizard_cards;
    }

    public function setupCards(): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $playersNbr = count($players);

        $wizardCards = [];
        foreach ($players as $player_id => $player) {
            $setupCounts = (array) $this->game->SETUP_COUNTS[$playersNbr];

            $wizardsNbr = (int) $setupCounts["wizards"];
            $wizardCards[] = ["type" => $player["player_color"], "type_arg" => $player_id, "nbr" => $wizardsNbr];
        }
        $this->createCards($wizardCards, $this->deck);

        foreach ($players as $player_id => $player) {
            $this->game->DbQuery("UPDATE wizard SET card_location='hand', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
        }
    }
}
