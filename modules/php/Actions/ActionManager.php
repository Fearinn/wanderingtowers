<?php

namespace Bga\Games\WanderingTowers\Actions;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

class ActionManager
{
    public Table $game;
    public $gamestate;
    public Globals $globals;
    public int $player_id;

    public function __construct(Table $game)
    {
        $this->game = $game;
        $this->gamestate = $this->game->gamestate;
        $this->globals = $this->game->globals;
        $this->player_id = (int) $this->game->getActivePlayerId();
    }
}
