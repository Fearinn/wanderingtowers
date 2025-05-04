<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use Bga\Games\WanderingTowers\components\Wizard\Wizard;

use const Bga\Games\WanderingTowers\G_DICE_FACE;
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

    public function call(): void {
        $wizardCard_id = $this->globals->get(G_WIZARD);
        $Wizard = new Wizard($this->game, $wizardCard_id);

        $steps = $this->globals->get(G_DICE_FACE);
        $Wizard->moveBySteps($steps);

        $this->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
