<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use Bga\Games\WanderingTowers\components\Move\Move;
use Bga\Games\WanderingTowers\components\Wizard\Wizard;
use Bga\Games\WanderingTowers\components\Dice\Dice;

use const Bga\Games\WanderingTowers\G_DICE_FACE;
use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\G_WIZARD;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;
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
        $this->globals->set(G_DICE_FACE, $face);

        $this->gamestate->nextState(TR_REROLL_DICE);
    }
}
