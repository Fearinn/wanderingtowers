<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

use const Bga\Games\WanderingTowers\G_MOVE;
use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\G_TOWER;
use const Bga\Games\WanderingTowers\G_TURN_MOVE;
use const Bga\Games\WanderingTowers\G_WIZARD;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;

class StBetweenPlayers extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function activeNextPlayer(): int
    {
        return $this->game->wtw_activeNextPlayer();
    }

    public function enter()
    {
        $this->globals->set(G_MOVE, null);
        $this->globals->set(G_TOWER, null);
        $this->globals->set(G_WIZARD, null);
        $this->globals->set(G_REROLLS, 0);
        $this->globals->set(G_TURN_MOVE, 0);

        $player_id = $this->game->getActivePlayerId();
        $MoveManager = new MoveManager($this->game);
        $MoveManager->refillHand($player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "message",
            clienttranslate('${player_name} ends his turn'),
        );

        $this->activeNextPlayer();
        $this->game->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
