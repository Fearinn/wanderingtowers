<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;

use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;

class ActAdvanceTower extends ActionManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function validate(int $space_id, int $tier): void
    {
        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);
        $towerCard_id = (int) $towerCard["id"];

        $Tower = new Tower($this->game, $towerCard_id);

        if (!$Tower->isAdvanceable()) {
            throw new \BgaVisibleSystemException("You can't advance this tower");
        }
    }

    public function act(int $space_id, int $tier): void
    {
        $this->validate($space_id, $tier);

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);
        $towerCard_id = (int) $towerCard["id"];

        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->move(1, $this->player_id);

        $this->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
