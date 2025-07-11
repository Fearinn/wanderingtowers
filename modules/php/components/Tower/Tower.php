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
    public int $id;
    public array $info;

    public function __construct(Table $game, #[IntParam(min: 1, max: 10)] int $towerCard_id)
    {
        parent::__construct($game);
        $this->card_id = $towerCard_id;

        $card = $this->getCard($this->card_id);
        $this->tier = $card["tier"];
        $this->id = $card["type_arg"];
        $this->info = $this->game->TOWERS[$this->id];
    }

    public function isRavenskeep(): bool
    {
        return $this->id === 1;
    }

    public function isRaven(): bool
    {
        return $this->info["raven"];
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
        // $WizardManager->freeUpWizards($current_space_id, $current_tier - 1);

        $final_space_id = $this->game->sumSteps($current_space_id, $steps);

        $this->moveLocationArg($this->card_id, $final_space_id);

        $WizardManager->moveWizardsWithTower(
            $current_space_id,
            $current_tier,
            $this->card_id
        );

        $tier = $this->countOnSpace($final_space_id);
        $this->updateTier($tier);

        if (!$stacked) {
            $NotifManager = new NotifManager($this->game);
            $NotifManager->all(
                "message",
                clienttranslate('${player_name} moves a tower by ${steps_label} space(s) ${direction_label}'),
                [
                    "steps_label" => abs($steps),
                    "direction_label" => $steps > 0 ? clienttranslate("clockwise") : clienttranslate("counterclockwise"),
                    "i18n" => ["direction_label"],
                ]
            );

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
                "",
                [
                    "cards" => $cards,
                    "final_space_id" => $final_space_id,
                    "current_space_id" => $current_space_id,
                ]
            );
            return;
        }

        $towerCard_id = (int) $towerCard["id"];
        $Tower = new Tower($this->game, $towerCard_id);
        $Tower->move($steps, $player_id, $cards, true);
    }

    public function isPushable(): bool
    {
        if ($this->isRavenskeep()) {
            return false;
        }

        $space_id = $this->game->sumSteps($this->getSpaceId(), 1);
        return $space_id !== $this->getRavenskeepSpace();
    }
}
