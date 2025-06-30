<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;

class ActPass extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function validate(): void
    {
        $moveLimit = $this->game->MOVE_LIMIT();
        if ($this->globals->get(G_TURN_MOVE) < $moveLimit) {
            throw new \BgaVisibleSystemException("You must play a movement");
        }
    }

    public function act(): void
    {
        $this->validate();

        $this->gamestate->nextState(TR_PASS);
    }
}
