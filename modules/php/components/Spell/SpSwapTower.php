<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;

class SpSwapTower extends Spell
{
    public function __construct(Table $game)
    {
        parent::__construct($game, 6);
    }

    public function validate(int $player_id, int $space_id): void
    {
        $TowerManager = new TowerManager($this->game);
        $tier = $TowerManager->countOnSpace($space_id);
        $towerCard = $TowerManager->getByTier($space_id, $tier);

        if (!$towerCard) {
            throw new \BgaVisibleSystemException("Tower not found");
        }

        $towerCard_id = (int) $towerCard["id"];
        $spellableMeeples = (array) $this->getSpellableMeeples($player_id)[$this->type];

        if (in_array($towerCard_id, $spellableMeeples)) {
            throw new \BgaVisibleSystemException("You can't cast Swap a Tower");
        }
    }

    public function cast(int $player_id, int $space_id): void
    {
        $this->validate($player_id, $space_id);

        $this->usePotions($player_id);

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByMaxTier($space_id);
        $towerCard_id = (int) $towerCard["id"];

        $space2_id = $this->game->sumSteps($space_id, $this->steps);
        $towerCard2 = $TowerManager->getByMaxTier($space2_id);
        $towerCard2_id = (int) $towerCard2["id"];

        $TowerManager->swapTowers($towerCard_id, $towerCard2_id, $this->steps, $player_id);
    }
}
