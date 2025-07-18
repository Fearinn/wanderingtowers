<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\SpAdvanceTower;
use Bga\Games\WanderingTowers\Components\Spell\SpAdvanceWizard;
use Bga\Games\WanderingTowers\Components\Spell\SpFreeWizard;
use Bga\Games\WanderingTowers\Components\Spell\SpHeadwindTower;
use Bga\Games\WanderingTowers\Components\Spell\SpHeadwindWizard;
use Bga\Games\WanderingTowers\Components\Spell\SpNudgeRavenskeep;
use Bga\Games\WanderingTowers\Components\Spell\SpSwapTower;

class ActCastSpell extends ActionManager
{
    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        parent::__construct($game, $CLIENT_VERSION);
    }

    public function validate()
    {
        if ($this->globals->get(G_SPELL_CASTED)) {
            throw new \BgaVisibleSystemException("You can't cast other spell this turn");
        }

        if ($this->game->isSolo() && $this->globals->get(G_TURN_MOVE) === 0) {
            throw new \BgaVisibleSystemException("You must play a movement before casting a spell");
        }
    }

    public function act(
        int $spell_id,
        ?int $meeple_id = null,
        ?int $tier = null,
        ?string $direction = null
    ): void {
        $this->validate();

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
                $SpAdvanceTower->cast($this->player_id, $meeple_id, $tier);
                break;

            case 4:
                $SpHeadwindTower = new SpHeadwindTower($this->game);
                $SpHeadwindTower->cast($this->player_id, $meeple_id, $tier);
                break;

            case 5:
                $SpNudgeRavenskeep = new SpNudgeRavenskeep($this->game);
                $SpNudgeRavenskeep->cast($this->player_id, $direction);
                break;

            case 6:
                $SpSwapTower = new SpSwapTower($this->game);
                $SpSwapTower->cast($this->player_id, $meeple_id);
                break;

            case 7:
                $SpFreeWizard = new SpFreeWizard($this->game);
                $SpFreeWizard->cast($this->player_id, $meeple_id, $tier);
                break;
        }

        $this->globals->set(G_SPELL_CASTED, true);
        $this->game->incStat(1, STAT_SPELLS_CASTED, $this->player_id);
        $this->gamestate->nextState(TR_NEXT_ACTION);
    }
}
