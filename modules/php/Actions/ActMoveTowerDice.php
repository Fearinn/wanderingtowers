<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;

class ActMoveTowerDice extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function act(int $space_id, int $tier): void
    {
        $moveCard_id = $this->globals->get(G_MOVE);
        $steps = $this->globals->get(G_ROLL);

        $ActMoveTower = new ActMoveTower($this->game, null);
        $ActMoveTower->act($moveCard_id, $space_id, $tier, $steps);
    }
}
