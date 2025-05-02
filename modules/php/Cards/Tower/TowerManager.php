<?php

namespace Bga\Games\WanderingTowers\Cards\Tower;

use Bga\Games\WanderingTowers\Cards\CardManager;

class TowerManager extends CardManager
{
    public function __construct($game)
    {
        parent::__construct($game, $game->tower_cards, "tower");
    }

    public function setupCards(): void
    {
        $towerCards = [];
        foreach ($this->game->TOWERS as $tower_id => $tower) {
            $towerCards[] = [
                "type" => $tower["raven"] ? 1 : 0,
                "type_arg" => $tower_id,
                "nbr" => 1,
            ];
        }
        $this->createCards($towerCards, "board");

        $towerCards = $this->getCards("deck");
        foreach ($towerCards as $towerCard_id => $towerCard) {
            $tower_id = (int) $towerCard["type_arg"];
            $this->moveByLocationArg($towerCard_id, $tower_id);
        }
    }
}
