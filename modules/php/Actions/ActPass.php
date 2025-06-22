<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\SpellManager;

class ActPass extends ActionManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
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
