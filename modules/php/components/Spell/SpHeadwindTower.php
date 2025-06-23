<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;

class SpHeadwindTower extends Spell
{
    public function __construct(Table $game)
    {
        parent::__construct($game, 4);
    }

    public function validate(int $player_id, int $space_id, int $tier): void
    {
        $this->baseValidation($player_id);

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);

        if (!$towerCard) {
            throw new \BgaVisibleSystemException("Tower not found");
        }

        $towerCard_id = (int) $towerCard["id"];
        $spellableMeeples = (array) $this->getSpellableMeeples($player_id)[$this->type];

        if (in_array($towerCard_id, $spellableMeeples)) {
            throw new \BgaVisibleSystemException("You can't cast Headwind for a Tower");
        }
    }

    public function cast(int $player_id, int $space_id, int $tier): void
    {
        $this->validate($player_id, $space_id, $tier);

        $this->usePotions($player_id);

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);
        $towerCard_id = (int) $towerCard["id"];

        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->move($this->steps, $player_id);
    }
}
