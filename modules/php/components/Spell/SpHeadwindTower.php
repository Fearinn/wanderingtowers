<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Tower\Tower;

class SpHeadwindTower extends Spell
{
    public function __construct(Table $game)
    {
        parent::__construct($game, 4);
    }

    public function validate(int $player_id, int $meeple_id): void
    {
        $this->validateSpell($player_id);

        $spellableMeeples = (array) $this->getSpellableMeeples($player_id)[$this->type];
        if (in_array($meeple_id, $spellableMeeples)) {
            throw new \BgaVisibleSystemException("You can't cast Headwind for a Tower");
        }
    }

    public function cast(int $player_id, int $meeple_id): void
    {
        $this->usePotions($player_id);
        $Tower = new Tower($this->game, $meeple_id);
        $Tower->move($this->steps, $player_id);
    }
}
