<?php

namespace Bga\Games\WanderingTowers\Components\Move;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Actions\Types\StringParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Move extends MoveManager
{
    public int $id;
    public int $card_id;
    public string $type;
    public array $move;

    public function __construct(Table $game, #[IntParam(min: 1, max: 90)] int $moveCard_id)
    {
        parent::__construct($game);

        $this->card_id = $moveCard_id;
        $card = $this->getCard($this->card_id);

        $this->id = (int) $card["type_arg"];
        $this->move = $this->game->MOVES[$this->id];
        $this->type = (string) $this->move["type"];
    }

    public function getMoveCard(): array
    {
        return $this->getCard($this->card_id);
    }

    public function getSteps(#[StringParam(enum: ["wizard", "tower"])] string $side): int
    {
        $steps = $this->move[$side];
        return (int) $steps;
    }

    public function isDice(): bool
    {
        return $this->card_id >= 19;
    }

    public function getOwner()
    {
        $card = $this->getMoveCard();
        return (int) $card["location_arg"];
    }

    public function validateType(#[StringParam(enum: ["wizard", "tower"])] string $side): void
    {
        if ($this->type !== "both" && $this->type !== $side) {
            throw new \BgaVisibleSystemException("Wrong movement type");
        }
    }

    public function validateHand(int $player_id): void
    {
        $location = $this->getMoveCard()["location"];
        $owner_id = $this->getOwner();

        if ($location !== "hand" || $owner_id !== $player_id) {
            throw new \BgaVisibleSystemException("This movement card is not in your hand");
        }
    }

    public function discard(): void
    {
        $this->moveCard($this->card_id, "discard");

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "discardMove",
            "",
            [
                "card" => $this->getCard($this->card_id)
            ]
        );
    }
}
