<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;

class StSpellSelection extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function enter(): void
    {
        $args = $this->getArgs();
        if ($args["no_notify"]) {
            $this->gamestate->nextState(TR_START_GAME);
        }
    }

    public function getArgs(): array
    {
        $soloManualSpells = $this->game->isSolo() &&
            $this->game->tableOptions->get(OPT_SPELLS_SOLO) === 2;

        $args = [
            "no_notify" => !$soloManualSpells,
        ];

        return $args;
    }
}
