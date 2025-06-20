<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Table;

class Spell extends SpellManager
{
    public array $SPELLS;
    public int $id;
    public array $info;
    public int $cost;
    public string $tr_name;
    public string $type;
    public int $steps;

    public function __construct(Table $game, #[IntParam(min: 1, max: 8)] int $spell_id)
    {
        parent::__construct($game);
        $this->id = $spell_id;
        $this->info = $this->SPELLS[$this->id];
        $this->cost = (int) $this->info["cost"];
        $this->type = $this->info["type"];
        $this->steps = $this->info["steps"];
    }

    public function usePotions(int $player_id): void
    {
        $PotionManager = new PotionManager($this->game);
        $PotionManager->usePotions($this->cost, $player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "message",
            clienttranslate('${player_name} casts ${spell_label}'),
            [
                "spell_label" => $this->tr_name,
                "i18n" => ["spell_label"],
            ]
        );
    }

    public function getSpellableMeeples(int $player_id): array
    {
        return parent::getSpellableMeeples($player_id)[$this->id];
    }

    public function canPayCost(int $player_id): bool
    {
        $PotionManager = new PotionManager($this->game);
        return $this->cost <= $PotionManager->countFilled($player_id);
    }

    public function isCastable(int $player_id): bool
    {
        $onTable = $this->game->getUniqueValueFromDB("SELECT card_location FROM {$this->dbTable} WHERE card_type_arg={$this->id}") === "table";

        if (!$onTable) {
            return false;
        }

        $hasMeeples = $this->type === "auto" || !!$this->getSpellableMeeples($player_id)[$this->type];

        return $this->canPayCost($player_id) && $hasMeeples;
    }

    public function baseValidation(int $player_id): void
    {
        if (!$this->isCastable($player_id)) {
            throw new \BgaVisibleSystemException("You can't cast this spell");
        }
    }
}
