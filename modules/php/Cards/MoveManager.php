<?php

namespace Bga\Games\WanderingTowers\Cards;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Actions\Types\StringParam;

class MoveManager extends CardManager
{
    public function __construct(\Table $game)
    {
        parent::__construct($game, $game->move_cards, "move");
    }

    public function setupCards(): void
    {
        $move_cards = [];
        foreach ($this->game->MOVES as $move_id => $move) {
            $move_cards[] = ["type" => $move["type"], "type_arg" => $move_id, "nbr" => $move["count"]];
        }
        $this->createShuffledCards($move_cards);

        $players = $this->game->loadPlayersBasicInfos();
        foreach ($players as $player_id => $player) {
            $this->pickCards(3, $player_id);
        }
    }

    public function getMove(#[IntParam(min: 1, max: 16)] int $moveCard_id): array
    {
        $moveCard = $this->getCard($moveCard_id);
        $move_id = (int) $moveCard["type_arg"];

        return $this->game->MOVES[$move_id];
    }

    public function getSteps(int $moveCard_id, #[StringParam(enum: ["wizard", "tower"])] $side): int
    {
        $move = $this->getMove($moveCard_id);
        return (int) $move[$side];
    }

    public function validateType(int $moveCard_id, #[StringParam(enum: ["wizard", "tower"])] $side): void
    {
        $move = $this->getMove($moveCard_id);

        if ($move["type"] !== $side) {
            throw new \BgaVisibleSystemException("Wrong move type");
        }
    }
}
