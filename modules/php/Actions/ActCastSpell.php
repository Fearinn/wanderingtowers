<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\SpAdvanceWizard;
use Bga\Games\WanderingTowers\Components\Spell\SpHeadwindWizard;

class ActCastSpell extends ActionManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function act(int $spell_id, $args): void
    {
        switch ($spell_id) {
            case 1:
                $SpAdvanceWizard = new SpAdvanceWizard($this->game, $args);
                $SpAdvanceWizard->cast($this->player_id);
                break;

            case 2:
                $SpHeadwindWizard = new SpHeadwindWizard($this->game, $args);
                $SpHeadwindWizard->cast($this->player_id);
                break;
        }

        $this->globals->set(G_SPELL_CASTED, true);
        $this->gamestate->nextState(TR_NEXT_ACTION);
    }
}
