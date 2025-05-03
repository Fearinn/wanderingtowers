<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use Bga\Games\WanderingTowers\Cards\Move\Move;
use Bga\Games\WanderingTowers\Cards\Wizard\Wizard;


use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;
use const Bga\Games\WanderingTowers\TR_REROLL_DICE;

class ActMoveWizard
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        $this->game = $game;
        $this->gamestate = $this->game->gamestate;
        $this->globals = $this->game->globals;
    }

    public function validate(int $player_id, int $moveCard_id, int $wizardCard_id): void
    {
        $Move = new Move($this->game, $moveCard_id);
        $Move->validateType("wizard");
        $Move->validateHand($player_id);

        $Wizard = new Wizard($this->game, $wizardCard_id);
        $Wizard->validateOwner($player_id);
    }

    public function act(int $player_id, int $moveCard_id, int $wizardCard_id): void
    {
        $this->validate($player_id, $moveCard_id, $wizardCard_id);

        $Move = new Move($this->game, $moveCard_id);
        $steps = $Move->getSteps("wizard");

        if ($this->globals->get(G_REROLLS, 0) > 0) {
            $this->gamestate->nextState(TR_REROLL_DICE);
            return;
        }

        $Wizard = new Wizard($this->game, $wizardCard_id);
        $Wizard->moveBySteps($wizardCard_id, $steps);
        
        $this->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
