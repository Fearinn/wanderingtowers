<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\SpPushWizard;
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
                $SpPushWizard = new SpPushWizard($this->game, $args);
                $SpPushWizard->cast($this->player_id);

            case 2:
                $SpHeadwindWizard = new SpHeadwindWizard($this->game, $args);
                $SpHeadwindWizard->cast($this->player_id);
        }

        $this->gamestate->nextState(TR_NEXT_ACTION);
    }
}
