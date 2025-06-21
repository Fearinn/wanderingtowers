<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

class ActAcceptRoll extends ActionManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function act(): void
    {
        $this->gamestate->nextState(TR_AFTER_ROLL);
    }
}
