<?php

namespace Bga\Games\WanderingTowers\Components\Tower;

use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Table;

class TowerManager extends CardManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game, $game->tower_cards, "tower");
        $this->fields .= ", tier";
    }

    public function setupCards(): void
    {
        $towerCards = [];
        foreach ($this->game->TOWERS as $tower_id => $tower) {
            $towerCards[] = [
                "type" => $tower["type"],
                "type_arg" => $tower_id,
                "nbr" => 1,
            ];
        }

        $this->createCards($towerCards, "space");
        $towerCards = $this->getCardsInLocation("space");

        foreach ($towerCards as $towerCard) {
            $towerCard_id = (int) $towerCard["id"];
            $tower_id = (int) $towerCard["type_arg"];
            $this->moveLocationArg($towerCard_id, $tower_id);
        }
    }

    public function countOnSpace(int $space_id): int
    {
        return (int) $this->countCardsInLocation("space", $space_id);
    }

    public function getTierCounts(): array
    {
        $tierCounts = [];
        foreach ($this->game->SPACES as $space_id => $space) {
            $tierCounts[$space_id] = $this->countOnSpace($space_id);
        }

        return $tierCounts;
    }

    public function getByTier(int $space_id, int $tier): ?array
    {
        $sql = "SELECT {$this->fields} from {$this->dbTable} WHERE card_location_arg={$space_id} AND tier={$tier}";
        $towerCard = $this->game->wtw_getObjectFromDB($sql);
        return $towerCard;
    }

    public function getByMaxTier(int $space_id): ?array
    {
        $maxTier = $this->countOnSpace($space_id);
        $towerCard = $this->getByTier($space_id, $maxTier);
        return $towerCard;
    }

    public function getMovable(int $moveCard_id): array
    {
        $Move = new Move($this->game, $moveCard_id);

        if ($Move->type !== "tower" && $Move->type !== "both") {
            return [];
        }

        $towerCards = $this->getCardsInLocation("space");

        if ($Move->isDice()) {
            if ($this->game->gamestate->state_id() === ST_AFTER_ROLL) {
                return $towerCards;
            }
            $steps = $this->game->globals->get(G_ROLL);
        } else {
            $steps = $Move->getSteps("tower");
        }

        $movableCards = array_filter($towerCards, function ($towerCard) use ($steps) {
            $towerCard_id = (int) $towerCard["id"];
            $Tower = new Tower($this->game, $towerCard_id);

            if ($Tower->isRavenskeep()) {
                return false;
            }

            $space_id = $this->game->sumSteps($Tower->getSpaceId(), $steps);

            $ravenskeepSpace = (int) $this->getRavenskeepSpace();
            return $space_id !== $ravenskeepSpace;
        });

        return array_values($movableCards);
    }

    public function getPushable(): array
    {
        if ($this->globals->get(G_TURN_MOVE) >= 1) {
            return [];
        }

        $towerCards = $this->getCardsInLocation("space");
        $pushableTowers = array_filter($towerCards, function ($towerCard) {
            $towerCard_id = (int) $towerCard["id"];
            $Tower = new Tower($this->game, $towerCard_id);

            return $Tower->isPushable();
        });

        return array_values($pushableTowers);
    }

    public function getSpellable(int $spell_id): array
    {
        $Spell = new Spell($this->game, $spell_id);

        if ($Spell->type !== "tower") {
            return [];
        }

        $towerCards = $this->getCardsInLocation("space");

        $steps = $Spell->steps;

        $spellableTowers = array_filter($towerCards, function ($towerCard) use ($steps, $spell_id) {
            $towerCard_id = (int) $towerCard["id"];
            $Tower = new Tower($this->game, $towerCard_id);

            if ($spell_id === 7) {
                $WizardManager = new WizardManager($this->game);
                $space_id = $Tower->getSpaceId();
                $tier = $Tower->countOnSpace($space_id);
                return $WizardManager->countOnSpace($space_id, $tier) < 6;
            }

            if ($Tower->isRavenskeep()) {
                return false;
            }

            $space_id = $this->game->sumSteps($Tower->getSpaceId(), $steps);

            if ($spell_id === 6 && !$this->getByMaxTier($space_id)) {
                return false;
            }

            $ravenskeepSpace = (int) $this->getRavenskeepSpace();
            return $space_id !== $ravenskeepSpace;
        });

        return array_values($spellableTowers);
    }

    public function getRavenskeepSpace(): int
    {
        $space_id = (int) $this->game->getUniqueValueFromDB("SELECT card_location_arg FROM {$this->dbTable} WHERE card_type_arg=1");
        return $space_id;
    }

    public function getRavenskeepCard(): array
    {
        return $this->game->wtw_getObjectFromDb("SELECT {$this->fields} FROM {$this->dbTable} WHERE card_type_arg=1");
    }

    public function moveRavenskeep(): void
    {
        $Ravenskeep = new Ravenskeep($this->game);
        $Ravenskeep->moveRavenskeep();
    }

    public function swapTowers(
        int $towerCard_id,
        int $towerCard2_id,
        int $player_id,
    ): void {
        $Tower = new Tower($this->game, $towerCard_id);
        $Tower2 = new Tower($this->game, $towerCard2_id);

        $tower_space_id = $Tower->getSpaceId();
        $tower2_space_id = $Tower2->getSpaceId();

        $tower_tier = $Tower->tier;
        $tower2_tier = $Tower2->tier;

        $this->moveLocationArg($Tower->card_id, $tower2_space_id);
        $this->moveLocationArg($Tower2->card_id, $tower_space_id);

        $WizardManager = new WizardManager($this->game);
        $WizardManager->swapWizardsAlongTower(
            $tower_space_id,
            $tower2_space_id,
            $tower_tier,
            $tower2_tier,
        );

        $WizardManager->swapWizardsAlongTower(
            $tower2_space_id,
            $tower_space_id,
            $tower2_tier,
            $tower_tier,
        );

        $Tower->updateTier($tower2_tier);
        $Tower2->updateTier($tower_tier);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "swapTower",
            "",
            [
                "towerCard" => $Tower->getCard($Tower->card_id),
                "final_space_id" => $tower2_space_id,
                "current_space_id" => $tower_space_id,
            ],
            $player_id,
        );
        $NotifManager->all(
            "swapTower",
            "",
            [
                "towerCard" => $Tower->getCard($Tower2->card_id),
                "final_space_id" => $tower_space_id,
                "current_space_id" => $tower2_space_id,
            ],
            $player_id,
        );
    }
}
