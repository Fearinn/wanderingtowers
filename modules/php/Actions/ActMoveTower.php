<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;

class ActMoveTower extends ActionManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function validate(int $moveCard_id, int $space_id, int $tier): void
    {
        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);
        $towerCard_id = (int) $towerCard["id"];

        $Move = new Move($this->game, $moveCard_id);
        $Move->validate("tower", $towerCard_id, $this->player_id);
    }

    public function act(int $moveCard_id, int $space_id, int $tier, int $steps = null): void
    {
        $this->validate($moveCard_id, $space_id, $tier);

        $Move = new Move($this->game, $moveCard_id);

        if (!$steps) {
            $steps = $Move->getSteps("tower");
        }

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);
        $towerCard_id = (int) $towerCard["id"];

        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->move($steps, $this->player_id);
        $Move->discard($this->player_id);

        $this->globals->inc(G_TURN_MOVE, 1);

        $this->gamestate->nextState(TR_NEXT_ACTION);
    }
}
