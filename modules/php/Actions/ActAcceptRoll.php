<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use const Bga\Games\WanderingTowers\TR_AFTER_ROLL;

class ActAcceptRoll extends ActionManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function act(): void
    {
        $this->gamestate->nextState(TR_AFTER_ROLL);
    }
}
