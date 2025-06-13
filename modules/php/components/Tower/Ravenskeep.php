<?php

namespace Bga\Games\WanderingTowers\Components\Tower;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Ravenskeep extends Tower
{
    public function __construct(Table $game)
    {
        $card_id = $game->getUniqueValueFromDB("SELECT card_id FROM tower WHERE card_type_arg=1");
        parent::__construct($game, $card_id);
    }

    public function moveRavenskeep(): void
    {
        $current_space_id = $this->getSpaceId();
        $current_tier = $this->tier;

        $next_space_id = $this->game->sumSteps($current_space_id, 1);
        $final_space_id = $current_space_id;
        for ($i = $next_space_id; $i !== $current_space_id; $i = $this->game->sumSteps($i, 1)) {
            $towerCard = $this->getByMaxTier($i);

            if (!$towerCard) {
                continue;
            }

            $towerCard_id = (int) $towerCard["id"];
            $Tower = new Tower($this->game, $towerCard_id);

            if ($Tower->isRaven()) {
                $final_space_id = $Tower->getSpaceId();
                break;
            };
        }

        if ($final_space_id === $current_space_id) {
            return;
        }

        $WizardManager = new WizardManager($this->game);
        $WizardManager->freeUpWizards($current_space_id, $current_tier);


        $this->moveCard($this->card_id, "space", $final_space_id);
        $final_tier = $this->countOnSpace($final_space_id);
        $this->updateTier($final_tier);

        $WizardManager->coverWizards($final_space_id, $final_tier - 1);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveTower",
            "",
            [
                "cards" => [$this->getCard($this->card_id)],
                "final_space_id" => $final_space_id,
                "current_space_id" => $current_space_id,
            ]
        );
    }
}
