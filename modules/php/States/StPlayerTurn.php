<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use BgaUserException;

use const Bga\Games\WanderingTowers\G_TURN_MOVE;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;

class StPlayerTurn extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function enter(): void
    {
        $args = $this->getArgs();
        if ($args["no_notify"]) {
            $this->gamestate->nextState(TR_NEXT_PLAYER);
        }
    }

    public function getArgs(): array
    {
        $player_id = (int) $this->game->getActivePlayerId();

        $MoveManager = new MoveManager($this->game);
        $playableMoves = $MoveManager->getPlayable($player_id);
        $movableMeeples = $MoveManager->getMovableMeeples($player_id);

        $TowerManager = new TowerManager($this->game);
        $advanceableTowers = $TowerManager->getAdvanceable();

        $endTurn = $this->globals->get(G_TURN_MOVE) >= 2;

        $args = [
            "playableMoves" => $MoveManager->hideCards($playableMoves),
            "movableMeeples" => $movableMeeples,
            "advanceableTowers" => $advanceableTowers,
            "no_notify" => $endTurn || (!$playableMoves && !$advanceableTowers),
        ];

        return $args;
    }
}
