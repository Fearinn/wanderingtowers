<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;

class ActMoveWizardDice extends ActionManager
{
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
    }
}
