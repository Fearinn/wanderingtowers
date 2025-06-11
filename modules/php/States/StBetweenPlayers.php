<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

use const Bga\Games\WanderingTowers\G_FINAL_TURN;
use const Bga\Games\WanderingTowers\G_MOVE;
use const Bga\Games\WanderingTowers\G_REROLLS;
use const Bga\Games\WanderingTowers\G_TOWER;
use const Bga\Games\WanderingTowers\G_TURN_MOVE;
use const Bga\Games\WanderingTowers\G_WIZARD;
use const Bga\Games\WanderingTowers\TR_GAME_END;
use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;

class StBetweenPlayers extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function activeNextPlayer(): int
    {
        return $this->game->wtw_activeNextPlayer();
    }

    public function enter()
    {
        $this->globals->set(G_MOVE, null);
        $this->globals->set(G_TOWER, null);
        $this->globals->set(G_WIZARD, null);
        $this->globals->set(G_REROLLS, 0);
        $this->globals->set(G_TURN_MOVE, 0);

        $player_id = $this->game->getActivePlayerId();
        $MoveManager = new MoveManager($this->game);
        $MoveManager->refillHand($player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "message",
            clienttranslate('${player_name} ends his turn'),
        );

        $this->game->incTurnsPlayed($player_id);
        $this->checkGameEnd();

        $this->activeNextPlayer();
        $this->game->gamestate->nextState(TR_NEXT_PLAYER);
    }

    public function checkGameEnd(): void
    {
        $players = $this->game->loadPlayersBasicInfos();

        foreach ($players as $player_id => $player) {
            if ($this->globals->get(G_FINAL_TURN)) {
                break;
            }

            $PotionManager = new PotionManager($this->game);
            $WizardManager = new WizardManager($this->game);

            $goalsMet = $PotionManager->goalMet($player_id) && $WizardManager->goalMet($player_id);

            if ($goalsMet) {
                $finalTurn = $this->game->getTurnsPlayed($player_id);

                if ($finalTurn > $this->globals->get(G_FINAL_TURN, 0)) {
                    $this->globals->set(G_FINAL_TURN, $finalTurn);
                }

                $NotifManager = new NotifManager($this->game);
                $NotifManager->all(
                    "finalTurn",
                    clienttranslate('${player_name} achieves both goals. This is the last round'),
                    [],
                    $player_id,
                );
            }
        }

        if (!$this->globals->get(G_FINAL_TURN, 0)) {
            return;
        }

        $gameEnd = true;
        foreach ($players as $player_id => $player) {
            if ($this->globals->get(G_FINAL_TURN) !== $this->game->getTurnsPlayed($player_id)) {
                $gameEnd = false;
                break;
            }
        }

        if ($gameEnd) {
            $this->gamestate->nextState(TR_GAME_END);
        }
    }
}
