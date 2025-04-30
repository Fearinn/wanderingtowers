<?php

namespace Bga\Games\WanderingTowers\Cards;

class PotionManager extends CardManager
{
    public function __construct(\Table $game)
    {
        parent::__construct($game);
        $this->deck = $this->game->potion_cards;
        $this->database = "potion";
    }

    public function setupCards(): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $playerNbr = count($players);

        $setupCounts = (array) $this->game->SETUP_COUNTS[$playerNbr];
        $potionCount = (int) $setupCounts["potions"];

        $potionCards = [];
        foreach ($players as $player_id => $player) {
         
            $potionCards[] = ["type" => $player["player_color"], "type_arg" => $player_id, "nbr" => $potionCount];
        }
        $this->createCards($potionCards);

        foreach ($players as $player_id => $player) {
            $this->game->DbQuery("UPDATE potion SET card_location='hand', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
        }
    }
}
