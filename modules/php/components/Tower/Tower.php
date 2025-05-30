<?php

namespace Bga\Games\WanderingTowers\Components\Tower;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Tower extends TowerManager
{
    public int $card_id;
    public int $tier;

    public function __construct(Table $game, #[IntParam(min: 1, max: 10)] int $towerCard_id)
    {
        parent::__construct($game);
        $this->card_id = $towerCard_id;

        $card = $this->getCard($this->card_id);
        $this->tier = $card["tier"];
    }

    public function getSpaceId(): int
    {
        $TowerCard = (array) $this->getCard($this->card_id);
        return $TowerCard["location_arg"];
    }

    public function updateTier(int $tier): void
    {
        $this->tier = $tier;
        $this->game->DbQuery("UPDATE {$this->dbTable} SET tier={$tier} WHERE card_id={$this->card_id}");
    }

    public function move(int $steps, int $player_id, &$cards = [], $stacked = false): void
    {
        $current_space_id = $this->getSpaceId($this->card_id);
        $current_tier = $this->tier;

        $WizardManager = new WizardManager($this->game);
        $WizardManager->freeUpWizards($current_space_id, $current_tier - 1);

        $final_space_id = $current_space_id + $steps;

        $this->moveByLocationArg($this->card_id, $final_space_id);

        $WizardManager->moveWizardsWithTower(
            $current_space_id,
            $current_tier,
            $this->card_id
        );

        $tier = $this->countOnSpace($final_space_id);

        $this->updateTier($tier);

        if (!$stacked) {
            $WizardManager->imprisonWizards(
                $final_space_id,
                $tier - 1,
                $player_id,
            );
        }

        $cards[] = $this->getCard($this->card_id);
        $this->moveStackedTower(
            $final_space_id,
            $current_space_id,
            $steps,
            $current_tier,
            $cards,
            $player_id,
        );
    }

    public function moveStackedTower(
        int $final_space_id,
        int $current_space_id,
        int $steps,
        int $tier,
        array &$cards,
        int $player_id,
    ): void {
        $towerCard = $this->getByTier($current_space_id, $tier + 1);

        if (!$towerCard) {
            $NotifManager = new NotifManager($this->game);
            $NotifManager->all(
                "moveTower",
                clienttranslate('${player_name} moves a tower by ${steps_label} space(s)'),
                [
                    "cards" => $cards,
                    "final_space_id" => $final_space_id,
                    "current_space_id" => $current_space_id,
                    "steps_label" => $steps
                ]
            );
            return;
        }

        $towerCard_id = (int) $towerCard["id"];
        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->move($steps, $player_id, $cards, true);
    }
}
