<?php

namespace Bga\Games\WanderingTowers\Components\Spell;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Tower\Ravenskeep;

class SpNudgeRavenskeep extends Spell
{

    public function __construct(Table $game)
    {
        parent::__construct($game, 5);
    }

    public function validate(int $player_id): void
    {
        $this->baseValidation($player_id);

        $Ravenskeep = new Ravenskeep($this->game);
        if (!$Ravenskeep->isNudgeable()) {
            throw new \BgaVisibleSystemException("You can't cast Nudge a Ravenskeep");
        }
    }

    public function cast(int $player_id, string $direction): void
    {
        $this->validate($player_id);

        $this->usePotions($player_id);
        $Ravenskeep = new Ravenskeep($this->game);
        $Ravenskeep->nudge($direction);
    }
}
