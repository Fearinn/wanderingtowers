<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Spell\SpellManager;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;

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
        $pushableTowers = $TowerManager->getPushable();

        $moveLimit = $this->game->MOVE_LIMIT();
        $turnMove = $this->globals->get(G_TURN_MOVE);

        $SpellManager = new SpellManager($this->game);
        $castableSpells = $SpellManager->getCastable($player_id);

        $endTurn = $turnMove === $moveLimit && !$castableSpells || ($turnMove > $moveLimit);

        $spellableMeeples = $SpellManager->getSpellableMeeples($player_id);

        $args = [
            "_private" => [
                "active" => [
                    "playableMoves" => $playableMoves,
                    "movableMeeples" => $movableMeeples,
                ],
            ],
            "pushableTowers" => $pushableTowers,
            "castableSpells" => $castableSpells,
            "spellableMeeples" => $spellableMeeples,
            "canPass" => $turnMove === $moveLimit && $castableSpells,
            "no_notify" => $endTurn || (!$playableMoves && !$pushableTowers && !$castableSpells),
        ];

        return $args;
    }
}
