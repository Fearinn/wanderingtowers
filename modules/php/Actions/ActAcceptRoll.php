<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;

class ActAcceptRoll extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function act(): void
    {
        $this->gamestate->nextState(TR_AFTER_ROLL);
    }
}
