<?php

namespace Bga\Games\WanderingTowers\Score;

use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Table;

class ScoreManager
{
    public Table $game;

    public function __construct(Table $game)
    {
        $this->game = $game;
    }

    public function setScore(int $score, int $player_id): void
    {
        $this->game->DbQuery("UPDATE player SET player_score={$score} WHERE player_id={$player_id}");
    }

    public function incScore(int $score, int $player_id): void
    {
        $this->game->DbQuery("UPDATE player SET player_score=player_score+{$score} WHERE player_id={$player_id}");
        $NotifManager = new NotifManager($this->game);

        $NotifManager->all(
            "incScore",
            "",
            ["score" => $score],
            $player_id,
        );
    }

    public function setScoreAux(int $score, int $player_id): void
    {
        $this->game->DbQuery("UPDATE player SET player_score_aux={$score} WHERE player_id={$player_id}");
    }

    public function incScoreAux(int $score, int $player_id): void
    {
        $this->game->DbQuery("UPDATE player SET player_score_aux=player_score_aux+{$score} WHERE player_id={$player_id}");
    }
}
