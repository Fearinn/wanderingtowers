<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;

class ActMoveWizardDice extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function act(int $wizardCard_id): void
    {
        $moveCard_id = $this->globals->get(G_MOVE);
        $steps = $this->globals->get(G_ROLL);

        $ActMoveWizard = new ActMoveWizard($this->game, null);
        $ActMoveWizard->act($moveCard_id, $wizardCard_id, $steps);
    }
}
