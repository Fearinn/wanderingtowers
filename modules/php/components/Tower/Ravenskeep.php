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

        $next_space_id = $this->game->sumSteps($current_space_id, 1);
        $final_space_id = $current_space_id;

        for (
            $space_id = $next_space_id;
            $space_id !== $current_space_id;
            $space_id = $this->game->sumSteps($space_id, 1)
        ) {
            $space = $this->game->SPACES[$space_id];

            $WizardManager = new WizardManager($this->game);
            $tier = $this->countOnSpace($space_id);

            if ($WizardManager->countOnSpace($space_id, $tier) > 0) {
                continue;
            }

            if ($space["raven"] && $tier === 0) {
                $final_space_id = $space_id;
                break;
            }

            $towerCard = $this->getByMaxTier($space_id);

            if (!$towerCard) {
                continue;
            }

            $towerCard_id = (int) $towerCard["id"];
            $Tower = new Tower($this->game, $towerCard_id);

            if ($Tower->isRaven()) {
                $final_space_id = $space_id;
                break;
            };
        }

        if ($final_space_id === $current_space_id) {
            return;
        }

        $this->moveCard($this->card_id, "space", $final_space_id);
        $final_tier = $this->countOnSpace($final_space_id);
        $this->updateTier($final_tier);

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

    public function isNudgeable(): bool
    {
        $hasEmptySpace = false;
        $WizardManager = new WizardManager($this->game);

        foreach ($this->game->SPACES as $space_id => $space) {
            $tier = $this->countOnSpace($space_id);
            $hasWizard = !!$this->game->getUniqueValueFromDB("SELECT card_id FROM {$WizardManager->dbTable} 
                WHERE card_location='space' AND card_location_arg={$space_id} AND tier={$tier}");

            if (!$hasWizard) {
                $hasEmptySpace = true;
                break;
            }
        }

        return $hasEmptySpace;
    }

    public function nudge(string $direction): void
    {
        $step = $direction === "clockwise" ? 1 : -1;

        $current_space_id = $this->getSpaceId();

        $next_space_id = $this->game->sumSteps($current_space_id, $step);
        $final_space_id = $current_space_id;

        $WizardManager = new WizardManager($this->game);

        for (
            $space_id = $next_space_id;
            $space_id !== $current_space_id;
            $space_id = $this->game->sumSteps($space_id, $step)
        ) {
            $tier = $this->countOnSpace($space_id);

            if ($WizardManager->countOnSpace($space_id, $tier) === 0) {
                $final_space_id = $space_id;
                break;
            }
        }

        if ($final_space_id === $current_space_id) {
            return;
        }

        $this->moveCard($this->card_id, "space", $final_space_id);
        $final_tier = $this->countOnSpace($final_space_id);
        $this->updateTier($final_tier);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveTower",
            clienttranslate('${player_name} nudges the Ravenskeep ${direction_label}'),
            [
                "cards" => [$this->getCard($this->card_id)],
                "final_space_id" => $final_space_id,
                "current_space_id" => $current_space_id,
                "direction_label" => $direction === "clockwise" ? clienttranslate("clockwise") : clienttranslate("counterclockwise"),
                "i18n" => ["direction_label"],
            ]
        );
    }
}
