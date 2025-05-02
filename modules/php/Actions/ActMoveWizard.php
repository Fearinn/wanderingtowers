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

    public function validate(int $player_id, int $moveCard_id, int $wizardCard_id): void
    {
        $MoveManager = new MoveManager($this->game);
        $MoveManager->validateType($moveCard_id, "wizard");

        $WizardManager = new WizardManager($this->game);
        $WizardManager->validateOwner($wizardCard_id, $player_id);
    }

    public function act(int $player_id, int $moveCard_id, int $wizardCard_id): void
    {
        $this->validate($player_id, $moveCard_id, $wizardCard_id);

        $MoveManager = new MoveManager($this->game);
        $steps = $MoveManager->getSteps($moveCard_id, "wizard");

        $WizardManager = new WizardManager($this->game);
        $WizardManager->moveBySteps($wizardCard_id, $steps);
    }
}
