<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Wizard\Wizard;

use const Bga\Games\WanderingTowers\G_DICE_FACE;
use const Bga\Games\WanderingTowers\G_MOVE;
use const Bga\Games\WanderingTowers\G_TOWER;
use const Bga\Games\WanderingTowers\G_WIZARD;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;

class ActAcceptRoll extends ActionManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function call(): void
    {
        $moveCard_id = $this->globals->get(G_MOVE);
        $wizardCard_id = $this->globals->get(G_WIZARD);
        $towerCard_id = $this->globals->get(G_TOWER);

        $steps = $this->globals->get(G_DICE_FACE);

        if ($wizardCard_id) {
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $Wizard->move($steps);
        } else if ($towerCard_id) {
            $Tower = new Tower($this->game, $towerCard_id);
            $Tower->move($steps);
        }

        $Move = new Move($this->game, $moveCard_id);
        $Move->discard();

        $this->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
