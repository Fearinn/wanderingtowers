<?php

namespace Bga\Games\WanderingTowers\Components\Tower;

use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Move\Move;
use BgaUserException;
use Table;

use const Bga\Games\WanderingTowers\G_ROLL;

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
                "type" => $tower["raven"] ? 1 : 0,
                "type_arg" => $tower_id,
                "nbr" => 1,
            ];
        }
        $this->createCards($towerCards, "space");

        $towerCards = $this->getCardsInLocation("deck");
        foreach ($towerCards as $towerCard_id => $towerCard) {
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
        /** @disregard P1013 Undefined Method */
        $card = $this->game->wtw_getObjectFromDB($sql);
        return $card;
    }

    public function getMovable(int $moveCard_id, int $player_id): array
    {
        $Move = new Move($this->game, $moveCard_id);

        if ($Move->type !== "tower" && $Move->type !== "both") {
            return [];
        }

        $movableCards = $this->getCardsInLocation("space");

        if ($Move->isDice()) {
            if ($this->game->gamestate->state_id() === ST_AFTER_ROLL) {
                return $movableCards;
            }
            $steps = $this->game->globals->get(G_ROLL);
        } else {
            $steps = $Move->getSteps("tower");
        }

        $movableCards = array_filter($movableCards, function ($towerCard) use ($steps) {
            $towerCard_id = (int) $towerCard["id"];
            $Tower = new Tower($this->game, $towerCard_id);

            if ($Tower->isRavenskeep()) {
                return false;
            }

            $space_id = $this->game->sumSteps($Tower->getSpaceId(), $steps);

            if ($space_id > 16) {
                $space_id -= 16;
            }

            $ravenskeepSpace = (int) $this->getRavenskeepSpace();
            return $space_id !== $ravenskeepSpace;
        });

        return array_values($movableCards);
    }

    public function getRavenskeepSpace(): int
    {
        $space_id = (int) $this->game->getUniqueValueFromDB("SELECT card_location_arg FROM {$this->dbTable} WHERE card_type_arg=1");
        return $space_id;
    }
}
