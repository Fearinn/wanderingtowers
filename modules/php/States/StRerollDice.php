<?php

namespace Bga\Games\WanderingTowers\states;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Actions\ActAcceptRoll;
use Bga\Games\WanderingTowers\Components\Dice\Dice;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;

class StRerollDice extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function enter()
    {
        $rerolls = (int) $this->globals->get(G_REROLLS);

        $moveCard_id = $this->globals->get(G_MOVE);
        $TowerManager = new TowerManager($this->game);
        $WizardManager = new WizardManager($this->game);

        $movableWizards = $WizardManager->getMovable($moveCard_id, $this->player_id);
        $movableTowers = $TowerManager->getMovable($moveCard_id);

        if (!$movableWizards && !$movableTowers) {
            $Dice = new Dice($this->game);
            $Dice->reroll();

            $this->game->gamestate->nextState(TR_REROLL_DICE);
            return;
        }

        if ($rerolls === 0) {
            $ActAcceptRoll = new ActAcceptRoll($this->game, null);
            $ActAcceptRoll->act();
        }
    }
}
