<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Actions\ActAcceptRoll;
use Bga\Games\WanderingTowers\Actions\ActRerollDice;

use const Bga\Games\WanderingTowers\G_REROLLS;

class StRerollDice extends StateManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function call() {
        $rerolls = (int) $this->globals->get(G_REROLLS);

        if ($rerolls <= 0) {
            $ActAcceptRoll = new ActAcceptRoll($this->game);
            $ActAcceptRoll->call();
        }
    }
}