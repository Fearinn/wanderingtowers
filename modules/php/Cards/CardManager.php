<?php

namespace Bga\Games\WanderingTowers\Cards;

class CardManager
{
    public \Table $game;
    public \Deck $deck;
    public string $database;

    public function __construct($game, $deck)
    {
        $this->game = $game;
        $this->deck = $deck;
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

    public function getCards(string $location, string $location_arg = null): array
    {
        return array_values($this->deck->getCardsInLocation($location, $location_arg));
    }

    public function getCardInLocation(string $location, $location_arg): array
    {
        $cards = $this->getCards($location, $location_arg);

        if (!$cards) {
            throw new \BgaVisibleSystemException("no card found: {$location}, {$location_arg}");
        }

        return reset($cards);
    }

    public function transferCard(string $from, string $to, int $from_arg = null, int $to_arg = null): void
    {
        $card = $this->getCardInLocation($from, $from_arg);
        $card_id = (int) $card["id"];
        $this->deck->moveCard($card_id, $to, $to_arg);
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
