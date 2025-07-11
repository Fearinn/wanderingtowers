<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Wizard\Wizard;

class ActMoveWizard extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function validate(int $moveCard_id, int $wizardCard_id): void
    {
        $Move = new Move($this->game, $moveCard_id);
        $Move->validate("wizard", $wizardCard_id, $this->player_id);

        $Wizard = new Wizard($this->game, $wizardCard_id);
        $Wizard->validateOwner($this->player_id);
    }

    public function act(int $moveCard_id, int $wizardCard_id, int $steps = null): void
    {
        $this->validate($moveCard_id, $wizardCard_id);

        $Move = new Move($this->game, $moveCard_id);

        if (!$steps) {
            $steps = $Move->getSteps("wizard");
        }

        $Wizard = new Wizard($this->game, $wizardCard_id);
        $Wizard->move($steps, $this->player_id);
        $Move->discard($this->player_id);

        $this->globals->inc(G_TURN_MOVE, 1);

        $this->gamestate->nextState(TR_NEXT_ACTION);
    }
}
