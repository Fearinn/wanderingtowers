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

    public function moveRavenskeep($nudge = false): void
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

            if ($space["raven"]) {
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
            $next_tier = $this->countOnSpace($space_id);

            $wizardCards = $WizardManager->getByTier($space_id, $next_tier);
            if (!$wizardCards) {
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
