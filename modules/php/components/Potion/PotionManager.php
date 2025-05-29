<?php

namespace Bga\Games\WanderingTowers\Components\Potion;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;

class PotionManager extends CardManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game, $game->potion_cards, "potion");
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
            $this->game->DbQuery("UPDATE potion SET card_location='empty', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
        }
    }
}
