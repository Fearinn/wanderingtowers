<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Wizard\Wizard;

class SpHeadwindWizard extends Spell
{
    public int $wizardCard_id;

    public function __construct(Table $game, array $args)
    {
        parent::__construct($game, 2);
        $this->wizardCard_id = (int) $args["wizardCard_id"];
    }

    public function cast(int $player_id): void
    {
        $this->usePotions($player_id);
        $Wizard = new Wizard($this->game, $this->wizardCard_id);
        $Wizard->move($this->steps, $player_id, true);
    }
}
