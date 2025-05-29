<?php

namespace Bga\Games\WanderingTowers\Components;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;
use Deck;

class CardManager
{
    public Table $game;
    public Deck $deck;
    public Globals $globals;
    public string $dbTable;
    public string $fields;

    public function __construct(Table $game, Deck $deck, string $dbTable)
    {
        $this->game = $game;
        $this->globals = $this->game->globals;
        $this->deck = $deck;
        $this->dbTable = $dbTable;
        $this->fields = "card_id id, card_type type, card_type_arg type_arg, card_location location, card_location_arg location_arg";
    }

    public function createCards(array $cards, string $location = "deck"): void
    {
        $this->deck->createCards($cards, $location);
    }

    public function createShuffledCards(array $cards, string $location = "deck"): void
    {
        $this->createCards($cards, $location);
        $this->deck->shuffle($location);
    }

    public function getCard(int $card_id): array
    {
        $sql = "SELECT {$this->fields} FROM {$this->dbTable} WHERE card_id={$card_id}";

        /** @disregard P1013 Undefined Method */
        $card = $this->game->wtw_getObjectFromDB($sql);

        if ($card === null) {
            throw new \BgaVisibleSystemException("card not found");
        }

        return $card;
    }

    public function getCardInLocation(string $location, int $location_arg = null): array
    {
        $cards = $this->getCardsInLocation($location, $location_arg);

        if (!$cards) {
            throw new \BgaVisibleSystemException("No card found");
        }

        return reset($cards);
    }


    public function getCardsInLocation(string $location, int $location_arg = null): array
    {
        $sql = "SELECT {$this->fields} FROM {$this->dbTable} WHERE card_location='{$location}'";

        if ($location_arg) {
            $sql .= " AND card_location_arg={$location_arg}";
        }

        $cards = $this->game->getCollectionFromDB($sql);
        return array_values($cards);
    }

    public function getPlayerHand(int $player_id): array
    {
        return array_values($this->deck->getPlayerHand($player_id));
    }

    public function getDeck(): array
    {
        $deck = $this->getCardsInLocation("deck");
        return $this->hideCards($deck);
    }

    public function getCardsByLocationArg(int $location_arg): array
    {
        return $this->game->getCollectionFromDB("SELECT {$this->fields} FROM {$this->dbTable} WHERE card_location_arg={$location_arg}");
    }

    public function transferCard(string $from, string $to, int $from_arg = 0, int $to_arg = 0): void
    {
        $card = $this->getCardInLocation($from, $from_arg, true);
        $card_id = (int) $card["id"];
        $this->deck->moveCard($card_id, $to, $to_arg);
    }

    public function moveCard(int $card_id, string $location, int $location_arg = 0): void
    {
        $this->deck->moveCard($card_id, $location, $location_arg);
    }

    public function moveByLocationArg(int $card_id, int $location_arg): void
    {
        $this->game->DbQuery("UPDATE {$this->dbTable} SET card_location_arg={$location_arg} WHERE card_id={$card_id}");
    }

    public function pickCards(int $nbr, int $player_id, string $location = "deck"): array
    {
        return $this->deck->pickCards($nbr, $location, $player_id);
    }

    public function countCardsInLocation(string $location, int $location_arg = null): int
    {
        return (int) $this->deck->countCardsInLocation($location, $location_arg);
    }

    public function countCardsInHand(?int $player_id): int
    {
        return $this->countCardsInLocation("hand", $player_id);
    }

    public function hideCard($card): array
    {
        $card["type_arg"] = null;

        return $card;
    }

    public function hideCards($cards): array
    {
        $cards = array_map(function ($card) {
            return $this->hideCard($card);
        }, $cards);

        return $cards;
    }
}
