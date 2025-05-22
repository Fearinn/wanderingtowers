<?php

namespace Bga\Games\WanderingTowers\Components\Wizard;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Wizard extends WizardManager
{
    public int $card_id;
    public int $owner;
    public int $tier;

    public function __construct(Table $game, #[IntParam(min: 1, max: 18)] int $wizardCard_id)
    {
        parent::__construct($game);
        $this->card_id = $wizardCard_id;
        $card = $this->getCard($this->card_id);

        $this->owner = (int) $card["type_arg"];
        $this->tier = (int) $card["tier"];
    }

    public function getSpaceId(): int
    {
        $wizardCard = (array) $this->getCard($this->card_id);
        return $wizardCard["location_arg"];
    }

    public function validateOwner(int $player_id): void
    {
        if ($this->owner !== $player_id) {
            throw new \BgaVisibleSystemException("Invalid wizard owner");
        }
    }

    public function moveBySteps(int $steps, bool $silent = false): void
    {
        $space_id = $this->getSpaceId($this->card_id);
        $space_id += $steps;

        $this->moveByLocationArg($this->card_id, $space_id);

        $TowerManager = new TowerManager($this->game);
        $tier = $TowerManager->countOnSpace($space_id);
        $this->updateTier($tier);

        $NotifManager = new NotifManager($this->game);

        $message = $silent ? "" : clienttranslate('${player_name} moves a wizard by ${steps_label} space(s)');
        $NotifManager->all(
            "moveWizard",
            $message,
            [
                "space_id" => $space_id,
                "card" => $this->getCard($this->card_id),
                "steps" => $steps,
                "steps_label" => $steps
            ]
        );
    }

    public function moveWithTower(int $towerCard_id): void
    {
        $Tower = new Tower($this->game, $towerCard_id);
        $space_id = $Tower->getSpaceId();

        $this->moveByLocationArg($this->card_id, $space_id);

        $TowerManager = new TowerManager($this->game);
        $tier = $TowerManager->countOnSpace($space_id);
        $this->updateTier($tier);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveWizard",
            "",
            [
                "space_id" => $space_id,
                "card" => $this->getCard($this->card_id)
            ],
        );
    }

    public function updateTier(int $tier): void
    {
        $this->tier = $tier;
        $this->game->DbQuery("UPDATE {$this->dbTable} SET tier={$tier} WHERE card_id={$this->card_id}");
    }

    public function toggleVisibility(bool $isVisible): void
    {
        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "toggleWizardVisibility",
            "",
            [
                "card" => $this->getCard($this->card_id),
                "isVisible" => $isVisible,
            ],
        );
    }

    public function imprison(): void
    {
        $this->toggleVisibility(false);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "imprisionWizard",
            "",
            [
                "card" => $this->getCard($this->card_id),
            ],
        );
    }

    public function freeUp(): void
    {
        $this->toggleVisibility(true);
    }
}
