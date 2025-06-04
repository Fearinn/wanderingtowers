<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;

use const Bga\Games\WanderingTowers\G_MOVE;
use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\G_TOWER;
use const Bga\Games\WanderingTowers\G_WIZARD;

class StBetweenPlayers extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function activeNextPlayer(): int
    {
        $player_id = $this->game->getActivePlayerId();
        $MoveManager = new MoveManager($this->game);
        $MoveManager->draw(1, $player_id);
        return $this->game->wtw_activeNextPlayer();
    }

    public function enter()
    {
        $this->globals->set(G_MOVE, null);
        $this->globals->set(G_TOWER, null);
        $this->globals->set(G_WIZARD, null);
        $this->globals->set(G_REROLLS, 0);

        $this->activeNextPlayer();
        $this->game->gamestate->nextState("nextPlayer");
    }
}
