<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;

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

        $args = [
            "playableMoves" => $playableMoves,
            "movableMeeples" => $movableMeeples,
        ];

        return $args;
    }
}
