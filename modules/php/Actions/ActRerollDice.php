<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use Bga\Games\WanderingTowers\Components\Dice\Dice;

use const Bga\Games\WanderingTowers\G_ROLL;
use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\TR_REROLL_DICE;

class ActRerollDice extends ActionManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function validate(): void
    {
        if ($this->globals->get(G_REROLLS) === 0) {
            throw new \BgaVisibleSystemException("No reroll left");
        }
    }

    public function act(): void
    {
        $this->validate();

        $Dice = new Dice($this->game);
        $face = $Dice->reroll();
        $this->globals->set(G_ROLL, $face);

        $this->gamestate->nextState(TR_REROLL_DICE);
    }
}
