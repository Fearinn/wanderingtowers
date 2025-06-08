<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;

class StPlayerTurn extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function getArgs(): array
    {
        $player_id = (int) $this->game->getActivePlayerId();

        $MoveManager = new MoveManager($this->game);
        $playableMoves = $MoveManager->getPlayable($player_id);
        $movableMeeples = $MoveManager->getMovableMeeples($player_id);

        $TowerManager = new TowerManager($this->game);
        $advanceableCards = $TowerManager->getAdvanceable();

        $args = [
            "playableMoves" => $playableMoves,
            "movableMeeples" => $movableMeeples,
            "advanceableTowers" => $advanceableCards,
        ];

        return $args;
    }
}
