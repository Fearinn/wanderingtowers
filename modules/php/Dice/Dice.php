<?php

namespace Bga\Games\WanderingTowers\Dice;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Dice
{
    public Table $game;
    public function __construct(Table $game)
    {
        $this->game = $game;
    }

    public function roll(): int
    {
        $face = bga_rand(1, 6);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "rollDie",
            clienttranslate('${player_name} rolls a ${face_label}'),
            [
                "face_label" => $face,
                "face" => $face,
            ],
        );

        return $face;
    }
}
