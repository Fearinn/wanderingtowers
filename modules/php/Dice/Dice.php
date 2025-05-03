<?php

namespace Bga\Games\WanderingTowers\Dice;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

use const Bga\Games\WanderingTowers\G_DICE_FACE;
use const Bga\Games\WanderingTowers\G_REROLLS;

class Dice
{
    public Table $game;
    public Globals $globals;

    public function __construct(Table $game)
    {
        $this->game = $game;
        $this->globals = $this->game->globals;
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

        $this->globals->set(G_DICE_FACE, $face);
        return $face;
    }

    public function reroll(): int
    {
        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "message",
            clienttranslate('${player_name} rerolls the die'),
        );

        $this->globals->inc(G_REROLLS, -1);
        return $this->roll();
    }
}
