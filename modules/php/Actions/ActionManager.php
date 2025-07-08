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

    public function __construct(Table $game, ?int $CLIENT_VERSION)
    {
        $this->game = $game;
        $this->gamestate = $this->game->gamestate;
        $this->globals = $this->game->globals;
        $this->player_id = (int) $this->game->getActivePlayerId();

        // $this->checkVersion($CLIENT_VERSION);
    }

    private function checkVersion(?int $CLIENT_VERSION)
    {
        if ($CLIENT_VERSION === null) {
            return;
        }

        /**  @disregard P1014 */
        $serverVersion = (int) $this->game->gamestate->table_globals[300];

        if ($CLIENT_VERSION !== $serverVersion) {
            throw new \BgaUserException(clienttranslate("A new version of this game is now available. Please reload the page (F5)."));
        }
    }
}
