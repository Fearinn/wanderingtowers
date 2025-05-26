<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use const Bga\Games\WanderingTowers\G_ROLL;
use const Bga\Games\WanderingTowers\G_MOVE;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;

class ActMoveTowerDice extends ActionManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function act(int $wizardCard_id): void
    {
        $moveCard_id = $this->globals->get(G_MOVE);
        $steps = $this->globals->get(G_ROLL);

        $ActMoveWizard = new ActMoveWizard($this->game);
        $ActMoveWizard->act($moveCard_id, $wizardCard_id, $steps);
        $this->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
