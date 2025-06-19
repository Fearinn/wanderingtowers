<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\SpAdvanceTower;
use Bga\Games\WanderingTowers\Components\Spell\SpAdvanceWizard;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Spell\SpHeadwindTower;
use Bga\Games\WanderingTowers\Components\Spell\SpHeadwindWizard;

class ActCastSpell extends ActionManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function act(int $spell_id, ?int $meeple_id): void
    {
        switch ($spell_id) {
            case 1:
                $SpAdvanceWizard = new SpAdvanceWizard($this->game);
                $SpAdvanceWizard->cast($this->player_id, $meeple_id);
                break;

            case 2:
                $SpHeadwindWizard = new SpHeadwindWizard($this->game);
                $SpHeadwindWizard->cast($this->player_id, $meeple_id);
                break;

            case 3:
                $SpAdvanceTower = new SpAdvanceTower($this->game);
                $SpAdvanceTower->cast($this->player_id, $meeple_id);
                break;

            case 4:
                $SpHeadwindTower = new SpHeadwindTower($this->game);
                $SpHeadwindTower->cast($this->player_id, $meeple_id);
                break;
        }

        $this->globals->set(G_SPELL_CASTED, true);
        $this->game->incStat(1, STAT_SPELLS_CASTED, $this->player_id);
        $this->gamestate->nextState(TR_NEXT_ACTION);
    }
}
