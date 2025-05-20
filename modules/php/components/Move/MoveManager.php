<?php

namespace Bga\Games\WanderingTowers\Components\Move;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class MoveManager extends CardManager
{
    public function __construct(Table $game)
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

    public function getDiscard(): array
    {
        return $this->getCardsInLocation("discard");
    }

    public function draw(int $nbr, int $player_id): void
    {
        $cards = $this->pickCards($nbr, $player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->player(
            $player_id,
            "drawMove",
            "",
            [
                "cards" => $cards,
            ]
        );
    }
}
