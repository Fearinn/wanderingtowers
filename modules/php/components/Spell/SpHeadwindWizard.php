<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Wizard\Wizard;

class SpHeadwindWizard extends Spell
{
    public int $wizardCard_id;

    public function __construct(Table $game)
    {
        parent::__construct($game, 2);
    }

    public function validate(int $player_id, int $target_id): void
    {
        $this->baseValidation($player_id);

        $spellableMeeples = (array) $this->getSpellableMeeples($player_id)[$this->type];
        if (in_array($target_id, $spellableMeeples)) {
            throw new \BgaVisibleSystemException("You can't cast Headwind for a Wizard");
        }
    }

    public function cast(int $player_id, int $target_id): void
    {
        $this->validate($player_id, $target_id);
        
        $this->usePotions($player_id);
        $Wizard = new Wizard($this->game, $target_id);
        $Wizard->move($this->steps, $player_id);
    }
}
