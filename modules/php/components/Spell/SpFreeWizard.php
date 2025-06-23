<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;

class SpFreeWizard extends Spell
{
    public function __construct(Table $game)
    {
        parent::__construct($game, 7);
    }

    public function validate(int $player_id, int $space_id, int $tier): void
    {
        $this->baseValidation($player_id);

        $TowerManager = new TowerManager($this->game);
        $towerCard = $TowerManager->getByTier($space_id, $tier);

        if (!$towerCard) {
            throw new \BgaVisibleSystemException("Tower not found");
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
        $WizardManager = new WizardManager($this->game);
        $WizardManager->freeWizards($space_id, $tier - 1, $player_id);
    }
}
