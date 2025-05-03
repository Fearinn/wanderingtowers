<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Db\Globals;
use Bga\GameFramework\Table;

class StateManager
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
