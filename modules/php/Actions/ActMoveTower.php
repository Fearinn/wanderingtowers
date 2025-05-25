<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;

use const Bga\Games\WanderingTowers\G_MOVE;
use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\G_TOWER;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;
use const Bga\Games\WanderingTowers\TR_REROLL_DICE;

class ActMoveTower extends ActionManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;

    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function validate(int $moveCard_id): void
    {
        $Move = new Move($this->game, $moveCard_id);
        $Move->validateType("tower");
        $Move->validateHand($this->player_id);
    }

    public function act(int $moveCard_id, int $space_id, int $tier): void
    {
        $this->validate($moveCard_id);

        $Move = new Move($this->game, $moveCard_id);
        $steps = $Move->getSteps("tower");

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);

        if (!$towerCard) {
            throw new \BgaVisibleSystemException("No tower in this space and tier");
        }

        $towerCard_id = (int) $towerCard["id"];

        if ($this->globals->get(G_REROLLS, 0) > 0) {
            $this->globals->set(G_TOWER, $towerCard_id);
            $this->globals->set(G_MOVE, $moveCard_id);
            $this->gamestate->nextState(TR_REROLL_DICE);
            return;
        }

        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->move($steps);
        $Move->discard();

        $this->gamestate->nextState(TR_NEXT_PLAYER);
    }
}
