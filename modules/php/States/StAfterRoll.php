<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;

class StAfterRoll extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function getArgs(): array
    {
        $moveCard_id = $this->globals->get(G_MOVE);
        $Move = new Move($this->game, $moveCard_id);

        $MoveManager = new MoveManager($this->game);
        $movableMeeples = $MoveManager->getMovableMeeples($this->player_id);

        $wizard_or_tower = $Move->type === "both" ? clienttranslate("wizard or tower") : $Move->type;

        $args = [
            "_private" => [
                "active" => [
                    "movableMeeples" => $movableMeeples,
                ]
            ],
            "moveCard" => $Move->getMoveCard(),
            "wizard_or_tower" => $wizard_or_tower,
            "i18n" => ["wizard_or_tower"],
        ];

        return $args;
    }
}
