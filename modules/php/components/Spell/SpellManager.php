<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\TableOptions;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Table;

class SpellManager extends CardManager
{
    public array $SPELLS;
    public TableOptions $tableOptions;

    public function __construct(Table $game)
    {
        parent::__construct($game, $game->spell_cards, "spell");
        $this->SPELLS = $this->game->SPELLS;
        $this->tableOptions = $this->game->tableOptions;
    }

    public function setupCards(): void
    {
        $spellCards = [];

        foreach ($this->SPELLS as $spell_id => $spell) {
            $spellCards[] = [
                "type" => $spell["type"],
                "type_arg" => $spell_id,
                "nbr" => 1,
            ];
        }

        $this->deck->createCards($spellCards, "deck");

        $opt_spells = $this->tableOptions->get(OPT_SPELLS);
        if ($opt_spells === 1) {
            $this->game->DbQuery("UPDATE {$this->dbTable} SET card_location='table' WHERE card_type_arg=1 OR card_type_arg=3");
        }

        if ($opt_spells === 2) {
            $this->deck->shuffle("deck");
            $spell_nbr = $this->tableOptions->get(OPT_SPELLS_NUMBER);
            $this->deck->pickCardsForLocation($spell_nbr, "deck", "table");
        }
    }

    public function getAll(): array
    {
        $spellCards = $this->game->getCollectionFromDB("SELECT {$this->fields} FROM {$this->dbTable} 
        WHERE card_location='table' OR card_location='deck'");

        return array_values($spellCards);
    }

    public function getCastable(int $player_id): array
    {
        if ($this->globals->get(G_SPELL_CASTED, false)) {
            return [];
        }

        $spellCards = $this->getCardsInLocation("table");
        $castableSpells = array_filter(
            $spellCards,
            function ($spellCard) use ($player_id) {
                $spell_id = (int) $spellCard["type_arg"];
                $Spell = new Spell($this->game, $spell_id);
                return $Spell->isCastable($player_id);
            }
        );

        return array_values($castableSpells);
    }

    public function getSpellableMeeples(int $player_id): array
    {
        $spellableMeeples = [];

        $castableSpells = $this->getCastable($player_id);

        $WizardManager = new WizardManager($this->game);
        $TowerManager = new TowerManager($this->game);

        foreach ($castableSpells as $spellCard) {
            $spell_id = (int) $spellCard["type_arg"];

            $spellableWizards = $WizardManager->getSpellable($spell_id, $player_id);
            $spellableTowers = $TowerManager->getSpellable($spell_id, $player_id);

            $spellableMeeples[$spell_id] = [
                "wizard" => $spellableWizards,
                "tower" => $spellableTowers,
            ];
        }

        return $spellableMeeples;
    }
}
