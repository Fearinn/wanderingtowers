<?php

namespace Bga\Games\WanderingTowers\Cards\Move;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Actions\Types\StringParam;
use Bga\GameFramework\Table;

class Move extends MoveManager
{
    public int $id;
    public int $card_id;
    public string $type;
    public array $move;

    public function __construct(Table $game, #[IntParam(min: 1, max: 18)] int $wizardCard_id)
    {
        parent::__construct($game);

        $card = $this->getCard($wizardCard_id);
        $this->card_id = $wizardCard_id;

        $this->id = (int) $card["type_arg"];
        $this->move = $this->game->MOVES[$this->id];
        $this->type = (string) $this->move["type"];
    }

    public function getSteps(#[StringParam(enum: ["wizard", "tower"])] string $side): int
    {
        return (int) $this->move[$side];
    }

    public function validateType(#[StringParam(enum: ["wizard", "tower"])] string $side): void
    {
        if ($this->type !== "both" && $this->type !== $side) {
            throw new \BgaVisibleSystemException("Wrong move type");
        }
    }
}
