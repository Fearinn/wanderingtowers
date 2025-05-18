<?php

namespace Bga\Games\WanderingTowers\components\Tower;

use Bga\Games\WanderingTowers\components\CardManager;
use Table;

class TowerManager extends CardManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game, $game->tower_cards, "tower");
        $this->fields .= ", tier";
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
