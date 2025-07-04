<?php

namespace Bga\Games\WanderingTowers\States;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Bga\Games\WanderingTowers\Score\ScoreManager;

class StBetweenPlayers extends StateManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game);
    }

    public function enter()
    {
        $this->globals->set(G_MOVE, null);
        $this->globals->set(G_TOWER, null);
        $this->globals->set(G_WIZARD, null);
        $this->globals->set(G_REROLLS, 0);
        $this->globals->set(G_TURN_MOVE, 0);
        $this->globals->set(G_SPELL_CASTED, false);

        $player_id = $this->game->getActivePlayerId();
        $MoveManager = new MoveManager($this->game);
        $MoveManager->refillHand($player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "message",
            clienttranslate('${player_name} ends his turn'),
        );

        $this->game->incTurnsPlayed($player_id);

        if ($this->checkGameEnd()) {
            $this->gamestate->nextState(TR_GAME_END);
            return;
        };

        $this->game->giveExtraTime($player_id);
        $this->game->wtw_activeNextPlayer();
        $this->game->gamestate->nextState(TR_NEXT_PLAYER);
    }

    public function checkGameEnd(): bool
    {
        $players = $this->game->loadPlayersBasicInfos();
        $NotifManager = new NotifManager($this->game);

        $MoveManager = new MoveManager($this->game);
        $isSolo = $this->game->isSolo();

        if ($isSolo && $MoveManager->countCardsInDeck() === 0) {
            return true;
        }

        $PotionManager = new PotionManager($this->game);
        $WizardManager = new WizardManager($this->game);
        $totalGoal = $PotionManager->getPotionsGoal() + $WizardManager->getRavenskeepGoal();

        $ScoreManager = new ScoreManager($this->game);

        foreach ($players as $player_id => $player) {
            if ($this->globals->get(G_FINAL_TURN)) {
                break;
            }

            $goalsMet = $ScoreManager->getScore($player_id) === $totalGoal;

            if ($goalsMet) {
                if ($isSolo) {
                    $score = $MoveManager->countCardsInDiscard() > 30 ? 0 : 1;
                    $ScoreManager->setScore($score, $player_id);
                    return true;
                }

                $finalTurn = $this->game->getTurnsPlayed($player_id);

                if ($finalTurn > $this->globals->get(G_FINAL_TURN, 0)) {
                    $this->globals->set(G_FINAL_TURN, $finalTurn);
                }

                $NotifManager->all(
                    "finalTurn",
                    clienttranslate('${player_name} achieves both goals. This is the last round'),
                    [],
                    $player_id,
                );
            } else if ($WizardManager->countCardsInLocation("space") === 0) {
                $NotifManager->all(
                    "message",
                    clienttranslate("All wizards are in the Ravenskeep. Nobody may fill more potions")
                );
                return true;
            }
        }

        if (!$this->globals->get(G_FINAL_TURN, 0)) {
            return false;
        }

        $gameEnd = true;
        foreach ($players as $player_id => $player) {
            if ($this->globals->get(G_FINAL_TURN) !== $this->game->getTurnsPlayed($player_id)) {
                $gameEnd = false;
                break;
            }
        }

        return $gameEnd;
    }
}
