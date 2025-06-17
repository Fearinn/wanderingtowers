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

    public function __construct(Table $game, #[IntParam(min: 1, max: 8)] int $spell_id)
    {
        parent::__construct($game);
        $this->id = $spell_id;
        $this->info = $this->SPELLS[$this->id];
        $this->cost = (int) $this->info["cost"];
        $this->tr_name = $this->info["tr_name"];
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

    public function isCastable(int $player_id): bool
    {
        $PotionManager = new PotionManager($this->game);
        return $this->cost <= $PotionManager->countFilled($player_id);
    }
}
