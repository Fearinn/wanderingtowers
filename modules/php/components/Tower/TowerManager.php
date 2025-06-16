<?php

namespace Bga\Games\WanderingTowers\Components\Tower;

use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Move\Move;
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
            $this->moveByLocationArg($towerCard_id, $tower_id);
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

        $cards = $this->getCardsInLocation("space");

        if ($Move->isDice()) {
            if ($this->game->gamestate->state_id() === ST_AFTER_ROLL) {
                return $cards;
            }
            $steps = $this->game->globals->get(G_ROLL);
        } else {
            $steps = $Move->getSteps("tower");
        }

        $movableCards = array_filter($cards, function ($towerCard) use ($steps) {
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

    public function getAdvanceable(): array
    {
        if ($this->globals->get(G_TURN_MOVE) === 1) {
            return [];
        }

        $towerCards = $this->getCardsInLocation("space");
        $advanceableTowers = array_filter($towerCards, function ($towerCard) {
            $towerCard_id = (int) $towerCard["id"];
            $Tower = new Tower($this->game, $towerCard_id);

            return $Tower->isAdvanceable();
        });

        return array_values($advanceableTowers);
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
}
