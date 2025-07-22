<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;

class ActPass extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function validate(): void
    {
        $moveLimit = $this->game->MOVE_LIMIT();
        $MoveManager = new MoveManager($this->game);

        $mustPlayMove = $this->globals->get(G_TURN_MOVE) < $moveLimit
            && $MoveManager->getPlayable($this->player_id);

        if ($mustPlayMove) {
            throw new \BgaVisibleSystemException("You must play a movement");
        }
    }

    public function act(): void
    {
        $this->validate();

        $this->gamestate->nextState(TR_PASS);
    }
}
