<?php

namespace Bga\Games\WanderingTowers;

class CardManager
{
    public \Table $game;
    public \Deck $deck;
    
    public function __construct($game) {
        $this->game = $game;
    }

    public function createCards(array $cards, \Deck $deck, string $location = "deck")
    {
        $deck->createCards($cards, $location);
    }

    public function createShuffledCards(array $cards, \Deck $deck, string $location = "deck")
    {
        $this->createCards($cards, $deck, $location);
        $deck->shuffle($location);
    }
}
