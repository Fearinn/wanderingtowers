<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Actions\Types\IntArrayParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\SpellManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Bga\Games\WanderingTowers\States\StateManager;

class ActSelectSpells extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function validate(array $spell_ids): void
    {
        foreach ($spell_ids as $spell_id) {
            if (!in_array($spell_id, range(1, 8))) {
                throw new \BgaVisibleSystemException("Invalid spell");
            }
        }
    }

    public function act(array $spell_ids): void
    {
        $this->validate($spell_ids);

        $SpellManager = new SpellManager($this->game);
        $spellCards = $SpellManager->getAll();

        $spellCards = array_filter(
            $spellCards,
            function ($spellCard) use ($spell_ids): bool {
                $spell_id = (int) $spellCard["type_arg"];

                return !in_array($spell_id, $spell_ids);
            }
        );

        foreach ($spellCards as $spellCard) {
            $spellCard_id = (int) $spellCard["id"];
            $SpellManager->moveCard($spellCard_id, "deck");
        }

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "discardSpells",
            clienttranslate('${player_name} selects his spells'),
            [
                "spellCards" => array_values($spellCards),
            ]
        );

        $this->gamestate->nextState(TR_START_GAME);
    }
}
