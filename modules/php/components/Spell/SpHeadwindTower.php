<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Tower\Tower;

class SpHeadwindTower extends Spell
{
    public int $towerCard_id;

    public function __construct(Table $game, array $args)
    {
        parent::__construct($game, 4);
        $this->towerCard_id = (int) $args["towerCard_id"];
    }

    public function cast(int $player_id): void
    {
        $this->usePotions($player_id);
        $Tower = new Tower($this->game, $this->towerCard_id);
        $Tower->move($this->steps, $player_id, true);
    }
}
