<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Actions\ActAcceptRoll;

class StRerollDice extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function enter()
    {
        $rerolls = (int) $this->globals->get(G_REROLLS);

        if ($rerolls === 0) {
            $ActAcceptRoll = new ActAcceptRoll($this->game);
            $ActAcceptRoll->act();
        }
    }
}
