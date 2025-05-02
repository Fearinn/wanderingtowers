<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\Games\WanderingTowers\Cards\Move\Move;
use Bga\Games\WanderingTowers\Cards\Wizard\Wizard;

class ActMoveWizard
{
    public \Table $game;

    public function __construct(\Table $game)
    {
        $this->game = $game;
    }

    public function validate(int $player_id, int $moveCard_id, int $wizardCard_id): void
    {
        $Move = new Move($this->game, $moveCard_id);
        $Move->validateType("wizard");

        $Wizard = new Wizard($this->game, $wizardCard_id);
        $Wizard->validateOwner($player_id);
    }

    public function act(int $player_id, int $moveCard_id, int $wizardCard_id): void
    {
        $this->validate($player_id, $moveCard_id, $wizardCard_id);

        $Move = new Move($this->game, $moveCard_id);
        $steps = $Move->getSteps("wizard");

        $Wizard = new Wizard($this->game, $wizardCard_id);
        $Wizard->moveBySteps($wizardCard_id, $steps);
    }
}
