<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class ActPushTower extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function validate(int $space_id, int $tier): void
    {
        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);
        $towerCard_id = (int) $towerCard["id"];

        $Tower = new Tower($this->game, $towerCard_id);

        if (!$Tower->isPushable()) {
            throw new \BgaVisibleSystemException("You can't push this tower");
        }
    }

    public function act(int $space_id, int $tier): void
    {
        $this->validate($space_id, $tier);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "message",
            clienttranslate('${player_name} discards his entire hand'),
        );

        $MoveManager = new MoveManager($this->game);
        $MoveManager->recycleHand($this->player_id);

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);
        $towerCard_id = (int) $towerCard["id"];

        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->move(1, $this->player_id);

        $moveLimit = $this->game->MOVE_LIMIT();
        $this->globals->set(G_TURN_MOVE, $moveLimit);

        $this->gamestate->nextState(TR_NEXT_ACTION);
    }
}
