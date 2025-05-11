<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;

use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\G_WIZARD;

class StBetweenPlayers extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function activeNextPlayer(): int
    {
        /** @disregard P1013 Undefined Method */
        return $this->game->wtw_activeNextPlayer();
    }

    public function enter()
    {
        $this->globals->set(G_WIZARD, null);
        $this->globals->set(G_REROLLS, 0);

        $this->activeNextPlayer();
        $this->game->gamestate->nextState("nextPlayer");
    }
}
