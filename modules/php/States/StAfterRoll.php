<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\Move;

use const Bga\Games\WanderingTowers\G_MOVE;

class StAfterRoll extends StateManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function getArgs(): array
    {
        $moveCard_id = $this->globals->get(G_MOVE);
        $Move = new Move($this->game, $moveCard_id);

        $args = [
            "moveCard" => $Move->getMoveCard(),
        ];

        return $args;
    }
}
