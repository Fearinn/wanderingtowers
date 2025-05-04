<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use Bga\Games\WanderingTowers\components\Move\Move;
use Bga\Games\WanderingTowers\components\Tower\Tower;

use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\G_WIZARD;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;
use const Bga\Games\WanderingTowers\TR_REROLL_DICE;

class ActMoveTower extends ActionManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function validate(int $moveCard_id): void
    {
        $Move = new Move($this->game, $moveCard_id);
        $Move->validateType("tower");
        $Move->validateHand($this->player_id);
    }

    public function act(int $moveCard_id, int $towerCard_id): void
    {
        $this->validate($moveCard_id, $towerCard_id);

        $Move = new Move($this->game, $moveCard_id);
        $steps = $Move->getSteps("tower");

        if ($this->globals->get(G_REROLLS, 0) > 0) {
            $this->globals->set(G_WIZARD, $towerCard_id);
            $this->gamestate->nextState(TR_REROLL_DICE);
            return;
        }

        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->moveBySteps($towerCard_id, $steps);
        
        $this->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
