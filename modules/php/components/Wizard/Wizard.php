<?php

namespace Bga\Games\WanderingTowers\Components\Wizard;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Tower\Tower;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Bga\Games\WanderingTowers\Score\ScoreManager;

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

    public function move(int $steps, int $player_id, bool $silent = false): void
    {
        $space_id = $this->getSpaceId($this->card_id);
        $space_id = $this->game->sumSteps($space_id, $steps);

        $this->moveLocationArg($this->card_id, $space_id);

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
                "wizardCard" => $this->getCard($this->card_id),
                "steps" => $steps,
                "steps_label" => $steps
            ]
        );

        $TowerManager = new TowerManager($this->game);
        $enteredRavenskeep = $space_id === $TowerManager->getRavenskeepSpace();
        if ($enteredRavenskeep) {
            $this->enterRavenskeep($player_id);
        }
    }

    public function enterRavenskeep(int $player_id): void
    {
        $TowerManager = new TowerManager($this->game);
        $space_id = $TowerManager->getRavenskeepSpace();
        $this->moveCard($this->card_id, "ravenskeep", $space_id);
        $TowerManager->moveRavenskeep($player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "enterRavenskeep",
            clienttranslate('A wizard of ${player_name} enters the Ravenskeep'),
            [
                "wizardCard" => $this->getCard($this->card_id),
            ],
            $player_id,
        );

        $ScoreManager = new ScoreManager($this->game);
        $ScoreManager->incScore(1, $player_id);

        $this->globals->set(G_TURN_MOVE, 3);
        $this->game->incStat(1, STAT_WIZARDS_RAVENSKEEP, $player_id);
    }

    public function moveWithTower(int $towerCard_id): void
    {
        $Tower = new Tower($this->game, $towerCard_id);
        $space_id = $Tower->getSpaceId();

        $this->moveLocationArg($this->card_id, $space_id);

        $TowerManager = new TowerManager($this->game);
        $tier = $TowerManager->countOnSpace($space_id);
        $this->updateTier($tier);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveWizard",
            "",
            [
                "space_id" => $space_id,
                "wizardCard" => $this->getCard($this->card_id)
            ],
        );
    }

    public function swapAlongTower(int $space_id, int $final_tier): void
    {
        $this->updateTier($final_tier);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveWizard",
            "",
            [
                "space_id" => $space_id,
                "wizardCard" => $this->getCard($this->card_id)
            ],
        );
    }

    public function updateTier(int $tier): void
    {
        $this->tier = $tier;
        $this->game->DbQuery("UPDATE {$this->dbTable} SET tier={$tier} WHERE card_id={$this->card_id}");
    }

    public function imprison(int $player_id): void
    {
        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "imprisionWizard",
            "",
            [
                "card" => $this->getCard($this->card_id),
            ],
        );

        $this->game->incStat(1, STAT_WIZARDS_IMPRISONED, $player_id);
    }

    public function free(int $player_id): void
    {
        $space_id = $this->getSpaceId();
        $TowerManager = new TowerManager($this->game);
        $max_tier = $TowerManager->countOnSpace($space_id);
        $this->updateTier($max_tier);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "freeWizard",
            clienttranslate('${player_name} successfully frees a wizard'),
            [
                "wizardCard" => $this->getCard($this->card_id),
            ],
            $player_id,
        );

        if ($space_id === $TowerManager->getRavenskeepSpace()) {
            $this->enterRavenskeep($player_id);
        }
    }
}
