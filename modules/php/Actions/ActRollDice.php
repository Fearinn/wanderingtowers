<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Dice\Dice;
use Bga\Games\WanderingTowers\Components\Move\Move;

use const Bga\Games\WanderingTowers\G_MOVE;
use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\TR_REROLL_DICE;

class ActRollDice extends ActionManager
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
        $Move->validate(null, null, $this->player_id);

        if (!$Move->isDice()) {
            throw new \BgaVisibleSystemException("No dice in this move");
        }
    }

    public function act(int $moveCard_id): void
    {
        $this->validate($moveCard_id);

        $Dice = new Dice($this->game);
        $Dice->roll();

        $Move = new Move($this->game, $moveCard_id);
        $rerolls = $Move->move["diceCount"] - 1;

        $this->globals->set(G_REROLLS, $rerolls);
        $this->globals->set(G_MOVE, $moveCard_id);
        
        $this->gamestate->nextState(TR_REROLL_DICE);
    }
}
