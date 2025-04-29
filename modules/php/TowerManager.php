<?php

namespace Bga\Games\WanderingTowers;

class TowerManager extends CardManager
{
    public function __construct($game) {
        parent::__construct($game);

        $this->deck = $this->game->tower_cards;
    }

    public function setupCards(): void {
        $towerCards = [];
        foreach ($this->game->TOWERS as $tower_id => $tower) {
            $towerCards[] = [
                "type" => (string) $tower["raven"],
                "type_arg" => $tower_id,
                "nbr" => 1,
            ];
        }
        $this->createCards($towerCards, $this->deck);

        $towerCards = $this->deck->getCardsInLocation("deck");
        foreach ($towerCards as $towerCard_id => $towerCard) {
            $tower_id = (int) $towerCard["type_arg"];
            $this->deck->moveCard($towerCard_id, "board", $tower_id);
        }
    }
}
