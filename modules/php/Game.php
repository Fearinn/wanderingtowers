<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * WanderingTowers implementation : © Matheus Gomes matheusgomesforwork@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * Game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 */

declare(strict_types=1);

namespace Bga\Games\WanderingTowers;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\Games\WanderingTowers\Actions\ActAcceptRoll;
use Bga\Games\WanderingTowers\Actions\ActMoveTowerDice;
use Bga\Games\WanderingTowers\Actions\ActMoveTower;
use Bga\Games\WanderingTowers\Actions\ActMoveWizard;
use Bga\Games\WanderingTowers\Actions\ActMoveWizardDice;
use Bga\Games\WanderingTowers\Actions\ActRerollDice;
use Bga\Games\WanderingTowers\Actions\ActRollDice;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Dice\Dice;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Bga\Games\WanderingTowers\States\StAfterRoll;
use Bga\Games\WanderingTowers\States\StBetweenPlayers;
use Bga\Games\WanderingTowers\States\StPlayerTurn;
use Bga\Games\WanderingTowers\States\StRerollDice;

const G_REROLLS = "rerolls";
const G_ROLL = "roll";
const G_MOVE = "move";
const G_WIZARD = "wizard";
const G_TOWER = "tower";
const TR_REROLL_DICE = "rerollDice";
const TR_NEXT_PLAYER = "nextPlayer";
const TR_AFTER_ROLL = "afterRoll";

require_once(APP_GAMEMODULE_PATH . "module/table/table.game.php");

class Game extends \Table
{
    public function __construct()
    {
        parent::__construct();

        require "material.inc.php";

        $this->initGameStateLabels([]);

        $this->tower_cards = $this->getNew("module.common.deck");
        $this->tower_cards->init("tower");

        $this->wizard_cards = $this->getNew("module.common.deck");
        $this->wizard_cards->init("wizard");

        $this->potion_cards = $this->getNew("module.common.deck");
        $this->potion_cards->init("potion");

        $this->move_cards = $this->getNew("module.common.deck");
        $this->move_cards->init("move");

        $NotifManager = new NotifManager($this);
        $NotifManager->addDecorator();
    }

    public function wtw_activeNextPlayer(): int
    {
        return (int) $this->activeNextPlayer();
    }

    public function wtw_getObjectFromDb(string $sql): array | null
    {
        $object = $this->getObjectFromDB($sql);
        return $object;
    }

    public function getStateId(): int
    {
        return (int) $this->gamestate->state_id();
    }

    /**
     * Player action, example content.
     *
     * In this scenario, each time a player plays a card, this method will be called. This method is called directly
     * by the action trigger on the front side with `bgaPerformAction`.
     *
     * @throws BgaUserException
     */

    public function actMoveWizard(
        #[IntParam(min: 1, max: 90)] int $moveCard_id,
        #[IntParam(min: 1, max: 18)] int $wizardCard_id
    ): void {
        if ($this->getStateId() === ST_AFTER_ROLL) {
            $ActMoveWizardDice = new ActMoveWizardDice($this);
            $ActMoveWizardDice->act($wizardCard_id);
            return;
        }

        $ActMoveWizard = new ActMoveWizard($this);
        $ActMoveWizard->act($moveCard_id, $wizardCard_id);
    }

    public function ActMoveTower(
        #[IntParam(min: 1, max: 90)] int $moveCard_id,
        #[IntParam(min: 1, max: 16)] int $space_id,
        int $tier,
    ): void {
        if ($this->getStateId() === ST_AFTER_ROLL) {
            $ActMoveTowerDice = new ActMoveTowerDice($this);
            $ActMoveTowerDice->act($space_id, $tier);
            return;
        }

        $ActMoveTower = new ActMoveTower($this);
        $ActMoveTower->act($moveCard_id, $space_id, $tier);
    }

    public function actRollDice(
        #[IntParam(min: 1, max: 90)] int $moveCard_id,
    ): void {
        $ActRollDice = new ActRollDice($this);
        $ActRollDice->act($moveCard_id);
    }

    public function actRerollDice(): void
    {
        $ActRerollDice = new ActRerollDice($this);
        $ActRerollDice->act();
    }

    public function actAcceptRoll(): void
    {
        $ActAcceptRoll = new ActAcceptRoll($this);
        $ActAcceptRoll->act();
    }

    public function actMoveTowerDice(
        #[IntParam(min: 1, max: 16)] int $space_id,
        int $tier,
    ): void {
        $ActMoveTowerDice = new ActMoveTowerDice($this);
        $ActMoveTowerDice->act($space_id, $tier);
    }

    public function actMoveWizardDice(
        #[IntParam(min: 1, max: 16)] int $wizardCard_id,
        int $tier,
    ): void {
        $ActMoveWizardDice = new ActMoveWizardDice($this);
        $ActMoveWizardDice->act($wizardCard_id, $tier);
    }

    /**
     * Game state arguments, example content.
     *
     * This method returns some additional information that is very specific to the `playerTurn` game state.
     *
     * @return array
     * @see ./states.inc.php
     */
    public function st_rerollDice(): void
    {
        $StRerollDice = new StRerollDice($this);
        $StRerollDice->enter();
    }

    public function arg_afterRoll(): array
    {
        $StAfterRoll = new StAfterRoll($this);
        return $StAfterRoll->getArgs();
    }

    public function arg_playerTurn(): array
    {
        $StPlayerTurn = new StPlayerTurn($this);
        return $StPlayerTurn->getArgs();
    }

    public function st_betweenPlayers(): void
    {
        $StBetweenPlayers = new StBetweenPlayers($this);
        $StBetweenPlayers->enter();
    }

    /**
     * Compute and return the current game progression.
     *
     * The number returned must be an integer between 0 and 100.
     *
     * This method is called each time we are in a game state with the "updateGameProgression" property set to true.
     *
     * @return int
     * @see ./states.inc.php
     */
    public function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


    /**
     * Migrate database.
     *
     * You don't have to care about this until your game has been published on BGA. Once your game is on BGA, this
     * method is called everytime the system detects a game running with your old database scheme. In this case, if you
     * change your database scheme, you just have to apply the needed changes in order to update the game database and
     * allow the game to continue to run with your new version.
     *
     * @param int $from_version
     * @return void
     */
    public function upgradeTableDb($from_version) {}

    protected function getAllDatas(): array
    {
        // WARNING: We must only return information visible by the current player.
        $current_player_id = (int) $this->getCurrentPlayerId();

        $TowerManager = new TowerManager($this);
        $WizardManager = new WizardManager($this);
        $PotionManager = new PotionManager($this);
        $MoveManager = new MoveManager($this);

        $gamedatas = [
            "players" => $this->getCollectionFromDb("SELECT `player_id` `id`, `player_score` `score` FROM `player`"),
            "diceFace" => $this->globals->get(G_ROLL, 3),
            "towerCards" => $TowerManager->getCardsInLocation("space"),
            "wizardCards" => $WizardManager->getCardsInLocation("space"),
            "potionCards" => $PotionManager->getCargos(),
            "moveDeck" => $MoveManager->getDeck(),
            "moveDiscard" => $MoveManager->getDiscard(),
            "hand" => $MoveManager->getPlayerHand($current_player_id),
            "tierCounts" => $TowerManager->getTierCounts(),
        ];

        return $gamedatas;
    }

    /**
     * Returns the game name.
     *
     * IMPORTANT: Please do not modify.
     */
    protected function getGameName()
    {
        return "wanderingtowers";
    }

    /**
     * This method is called only once, when a new game is launched. In this method, you must setup the game
     *  according to the game rules, so that the game is ready to be played.
     */
    protected function setupNewGame($players, $options = [])
    {
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos["player_colors"];

        foreach ($players as $player_id => $player) {
            $query_values[] = vsprintf("('%s', '%s', '%s', '%s', '%s')", [
                $player_id,
                array_shift($default_colors),
                $player["player_canal"],
                addslashes($player["player_name"]),
                addslashes($player["player_avatar"]),
            ]);
        }

        static::DbQuery(
            sprintf(
                "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES %s",
                implode(",", $query_values)
            )
        );

        $this->reattributeColorsBasedOnPreferences($players, $gameinfos["player_colors"]);
        $this->reloadPlayersBasicInfos();

        $this->activeNextPlayer();

        $TowerManager = new TowerManager($this);
        $TowerManager->setupCards();

        $WizardManager = new WizardManager($this);
        $WizardManager->setupCards();

        $PotionManager = new PotionManager($this);
        $PotionManager->setupCards();

        $MoveManager = new MoveManager($this);
        $MoveManager->setupCards();

        $this->globals->set(G_REROLLS, 0);
        $this->globals->set(G_ROLL, 3);
    }

    /**
     * This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
     * You can do whatever you want in order to make sure the turn of this player ends appropriately
     * (ex: pass).
     *
     * Important: your zombie code will be called when the player leaves the game. This action is triggered
     * from the main site and propagated to the gameserver from a server, not from a browser.
     * As a consequence, there is no current player associated to this action. In your zombieTurn function,
     * you must _never_ use `getCurrentPlayerId()` or `getCurrentPlayerName()`, otherwise it will fail with a
     * "Not logged" error message.
     *
     * @param array{ type: string, name: string } $state
     * @param int $active_player
     * @return void
     * @throws feException if the zombie mode is not supported at this game state.
     */
    protected function zombieTurn(array $state, int $active_player): void
    {
        $state_name = $state["name"];

        if ($state["type"] === "activeplayer") {
            switch ($state_name) {
                default: {
                        $this->gamestate->nextState("zombiePass");
                        break;
                    }
            }

            return;
        }

        // Make sure player is in a non-blocking status for role turn.
        if ($state["type"] === "multipleactiveplayer") {
            $this->gamestate->setPlayerNonMultiactive($active_player, '');
            return;
        }

        throw new \feException("Zombie mode not supported at this game state: \"{$state_name}\".");
    }

    public function debug_actMoveWizard(): void
    {
        $moveCard_id = 1;
        $wizardCard_id = 1;
        $this->actMoveWizard($moveCard_id, $wizardCard_id);
    }

    public function debug_actMoveTower(): void
    {
        $moveCard_id = 12;
        $space_id = 2;

        $this->actMoveTower($moveCard_id, $space_id, 1);
    }

    public function debug_rollDice(): void
    {
        $Dice = new Dice($this);
        $Dice->roll();
    }

    public function debug_setupOnTowers(): void
    {
        $WizardManager = new WizardManager($this);

        $player_id = (int) $this->getNextPlayerTable()[0];
        $WizardManager->setupOnTowers($player_id);
    }
}
