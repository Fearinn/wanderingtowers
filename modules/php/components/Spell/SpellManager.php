<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\Games\WanderingTowers\Components\CardManager;
use Table;

class SpellManager extends CardManager
{
    public array $SPELLS;

    public function __construct(Table $game)
    {
        parent::__construct($game, $game->spell_cards, "spell");
        $this->SPELLS = $this->game->SPELLS;
    }

    public function setupCards(): void
    {
        $spellCards = [];

        foreach ($this->SPELLS as $spell_id => $spell) {
            $spellCards[] = [
                "type" => (string) $spell["cost"],
                "type_arg" => $spell_id,
                "nbr" => 1,
            ];
        }

        $this->deck->createCards($spellCards, "deck");
        $this->deck->shuffle("deck");

        $this->deck->pickCardsForLocation(8, "deck", "table");
    }

    public function getAll(): array
    {
        $spellCards = $this->game->getCollectionFromDB("SELECT {$this->fields} FROM {$this->dbTable} 
        WHERE card_location='table' OR card_location='deck'");

        return array_values($spellCards);
    }
}
