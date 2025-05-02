<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\Games\WanderingTowers\Cards\MoveManager;
use Bga\Games\WanderingTowers\Cards\WizardManager;

class ActMoveWizard
{
    public \Table $game;

    public function __construct(\Table $game)
    {
        $this->game = $game;
    }

    public function validate(int $moveCard_id, int $wizardCard_id): void
    {
        $isValid = true;

        $MoveManager = new MoveManager($this->game);
        // $MoveManager->validate("wizard");
    }

    public function call(int $moveCard_id, int $wizardCard_id): void
    {
        $this->validate($moveCard_id, $wizardCard_id);

        $MoveManager = new MoveManager($this->game);
        $steps = $MoveManager->getSteps($moveCard_id, "wizard");

        $WizardManager = new WizardManager($this->game);
        $WizardManager->moveSteps($wizardCard_id, $steps);
    }
}
