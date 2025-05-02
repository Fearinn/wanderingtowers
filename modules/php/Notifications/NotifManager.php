<?php

namespace Bga\Games\WanderingTowers\Notifications;

use Bga\GameFramework\Notify;
use Table;

class NotifManager
{
    public Table $game;
    public Notify $notify;

    public function __construct(Table $game)
    {
        $this->game = $game;
        $this->notify = $game->notify;
    }

    public function decoratePlayerName(string $message, array &$args): void
    {
        if (
            isset($args["player_id"]) &&
            !isset($args["player_name"]) &&
            str_contains($message, '${player_name}')
        ) {
            $args["player_name"] = $this->game->getPlayerNameById($args["player_id"]);
        }
    }

    public function addDecorator(): void
    {
        $this->notify->addDecorator(
            function (
                string $message,
                array $args
            ): array {
                $this->decoratePlayerName($message, $args);
                return $args;
            }
        );
    }

    public function all(string $name, string $message, array $args = [], int $player_id = null): void
    {
        if ($player_id) {
            $args["player_id"] = $player_id;
        } else {
            $args["player_id"] = (int) $this->game->getActivePlayerId();
        }

        $this->notify->all(
            $name,
            $message,
            $args,
        );
    }

    public function player(int $player_id, string $name, string $message, array $args = []): void
    {
        $this->notify->player(
            $player_id,
            $name,
            $message,
            $args,
        );
    }
}
