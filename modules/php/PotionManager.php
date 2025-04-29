<?php

namespace Bga\Games\WanderingTowers;

class PotionManager extends CardManager
{
    public function __construct(\Table $game)
    {
        parent::__construct($game);
        $this->deck = $this->game->potion_cards;
    }

    public function setupCards(): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $playersNbr = count($players);

        $potionCards = [];
        foreach ($players as $player_id => $player) {
            $setupCounts = (array) $this->game->SETUP_COUNTS[$playersNbr];

            $potionsNbr = (int) $setupCounts["potions"];
            $potionCards[] = ["type" => $player["player_color"], "type_arg" => $player_id, "nbr" => $potionsNbr];
        }
        $this->createCards($potionCards, $this->deck);

        foreach ($players as $player_id => $player) {
            $this->game->DbQuery("UPDATE potion SET card_location='hand', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
        }
    }
}
