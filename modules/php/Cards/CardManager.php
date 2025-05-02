<?php

namespace Bga\Games\WanderingTowers\Cards;

class CardManager
{
    public \Table $game;
    public \Deck $deck;
    public string $dbTable;
    public string $cardProps;

    public function __construct(\Table $game, \Deck $deck, string $dbTable)
    {
        $this->game = $game;
        $this->deck = $deck;
        $this->dbTable = $dbTable;
        $this->cardProps = "card_id id, card_type type, card_type_arg type_arg, card_location location, card_location_arg location_arg";
    }

    public function createCards(array $cards, string $location = "deck")
    {
        $this->deck->createCards($cards, $location);
    }

    public function createShuffledCards(array $cards, string $location = "deck")
    {
        $this->createCards($cards, $location);
        $this->deck->shuffle($location);
    }

    public function getCard(int $card_id): array
    {
        $card = $this->deck->getCard($card_id);
        if (!$card) {
            throw new \BgaVisibleSystemException("Card not found");
        }

        return $card;
    }

    public function getCards(string $location, string $location_arg = null): array
    {
        return array_values($this->deck->getCardsInLocation($location, $location_arg));
    }

    public function getCardInLocation(string $location, $location_arg): array
    {
        $cards = $this->getCards($location, $location_arg);

        if (!$cards) {
            throw new \BgaVisibleSystemException("No card found");
        }

        return reset($cards);
    }

    public function getCardsByLocationArg(string $location_arg): array
    {
        return $this->game->getCollectionFromDB("SELECT {$this->cardProps} FROM {$this->dbTable} WHERE card_location_arg={$location_arg}");
    }

    public function transferCard(string $from, string $to, int $from_arg = null, int $to_arg = null): void
    {
        $card = $this->getCardInLocation($from, $from_arg);
        $card_id = (int) $card["id"];
        $this->deck->moveCard($card_id, $to, $to_arg);
    }

    public function moveLocationArg(int $card_id, int $location_arg): void
    {
        $this->game->DbQuery("UPDATE {$this->dbTable} SET card_location_arg={$location_arg} WHERE card_id={$card_id}");
    }

    public function pickCards(int $nbr, int $player_id, string $location = "deck"): array
    {
        return $this->deck->pickCards($nbr, $location, $player_id);
    }

    public function countCards(string $location, int $location_arg = null): int
    {
        return $this->deck->countCardsInLocation($location, $location_arg);
    }
}
