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

use Bga\GameFramework\Actions\Types\IntArrayParam;
use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Actions\Types\StringParam;
use Bga\Games\WanderingTowers\Actions\ActAcceptRoll;
use Bga\Games\WanderingTowers\Actions\ActPushTower;
use Bga\Games\WanderingTowers\Actions\ActCastSpell;
use Bga\Games\WanderingTowers\Actions\ActMoveTowerDice;
use Bga\Games\WanderingTowers\Actions\ActMoveTower;
use Bga\Games\WanderingTowers\Actions\ActMoveWizard;
use Bga\Games\WanderingTowers\Actions\ActMoveWizardDice;
use Bga\Games\WanderingTowers\Actions\ActPass;
use Bga\Games\WanderingTowers\Actions\ActRerollDice;
use Bga\Games\WanderingTowers\Actions\ActRollDice;
use Bga\Games\WanderingTowers\Actions\ActSelectSpells;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Components\Move\MoveManager;
use Bga\Games\WanderingTowers\Components\Dice\Dice;
use Bga\Games\WanderingTowers\Components\Spell\SpellManager;
use Bga\Games\WanderingTowers\Components\Wizard\Wizard;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Bga\Games\WanderingTowers\Score\ScoreManager;
use Bga\Games\WanderingTowers\States\StAfterRoll;
use Bga\Games\WanderingTowers\States\StBetweenPlayers;
use Bga\Games\WanderingTowers\States\StPlayerTurn;
use Bga\Games\WanderingTowers\States\StRerollDice;
use Bga\Games\WanderingTowers\States\StSpellSelection;

require_once(APP_GAMEMODULE_PATH . "module/table/table.game.php");

class Game extends \Table
{
    public function __construct()
    {
        parent::__construct();

        require "material.inc.php";
        require "constants.inc.php";

        $this->initGameStateLabels([
            OPT_SPELLS => 100,
            OPT_SPELLS_NUMBER => 101,
        ]);

        $this->tower_cards = $this->getNew("module.common.deck");
        $this->tower_cards->init("tower");

        $this->wizard_cards = $this->getNew("module.common.deck");
        $this->wizard_cards->init("wizard");

        $this->potion_cards = $this->getNew("module.common.deck");
        $this->potion_cards->init("potion");

        $this->move_cards = $this->getNew("module.common.deck");
        $this->move_cards->init("move");
        $this->move_cards->autoreshuffle = true;
        $this->move_cards->autoreshuffle_trigger = [
            "obj" => new MoveManager($this),
            "method" => "autoreshuffle",
        ];

        $this->spell_cards = $this->getNew("module.common.deck");
        $this->spell_cards->init("spell");

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

    public function isSolo(): bool
    {
        return $this->getPlayersNumber() === 1;
    }

    public function MOVE_LIMIT(): int
    {
        return $this->isSolo() ? 1 : 2;
    }

    public function sumSteps(int $initial, int $steps): int
    {
        $space_id = $initial + $steps;

        if ($space_id > 16) {
            $space_id -= 16;
        }

        if ($space_id < 1) {
            $space_id += 16;
        }

        return $space_id;
    }

    public function getTurnsPlayed(int $player_id): int
    {
        return (int) $this->getUniqueValueFromDB("SELECT turns_played FROM player WHERE player_id={$player_id}");
    }

    public function incTurnsPlayed(int $player_id): void
    {
        $this->DbQuery("UPDATE player SET turns_played=turns_played+1 WHERE player_id={$player_id}");

        $NotifManager = new NotifManager($this);
        $NotifManager->all(
            "incTurnsPlayed",
            "",
            [],
            $player_id
        );
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
        ?int $GAME_VERSION,
        #[IntParam(min: 1, max: 90)] int $moveCard_id,
        #[IntParam(min: 1, max: 18)] int $wizardCard_id
    ): void {
        if ($this->getStateId() === ST_AFTER_ROLL) {
            $ActMoveWizardDice = new ActMoveWizardDice($this, $GAME_VERSION);
            $ActMoveWizardDice->act($wizardCard_id);
            return;
        }

        $ActMoveWizard = new ActMoveWizard($this, $GAME_VERSION);
        $ActMoveWizard->act($moveCard_id, $wizardCard_id);
    }

    public function ActMoveTower(
        ?int $GAME_VERSION,
        #[IntParam(min: 1, max: 90)] int $moveCard_id,
        #[IntParam(min: 1, max: 16)] int $space_id,
        #[IntParam(min: 1, max: 10)] int $tier,
    ): void {
        if ($this->getStateId() === ST_AFTER_ROLL) {
            $ActMoveTowerDice = new ActMoveTowerDice($this, $GAME_VERSION);
            $ActMoveTowerDice->act($space_id, $tier);
            return;
        }

        $ActMoveTower = new ActMoveTower($this, $GAME_VERSION);
        $ActMoveTower->act($moveCard_id, $space_id, $tier);
    }

    public function actRollDice(
        ?int $GAME_VERSION,
        #[IntParam(min: 1, max: 90)] int $moveCard_id,
    ): void {
        $ActRollDice = new ActRollDice($this, $GAME_VERSION);
        $ActRollDice->act($moveCard_id);
    }

    public function actRerollDice(
        ?int $GAME_VERSION,
    ): void {
        $ActRerollDice = new ActRerollDice($this, $GAME_VERSION);
        $ActRerollDice->act();
    }

    public function actAcceptRoll(
        ?int $GAME_VERSION,
    ): void {
        $ActAcceptRoll = new ActAcceptRoll($this, $GAME_VERSION);
        $ActAcceptRoll->act();
    }

    public function actMoveTowerDice(
        ?int $GAME_VERSION,
        #[IntParam(min: 1, max: 16)] int $space_id,
        #[IntParam(min: 1, max: 10)] int $tier,
    ): void {
        $ActMoveTowerDice = new ActMoveTowerDice($this, $GAME_VERSION);
        $ActMoveTowerDice->act($space_id, $tier);
    }

    public function actMoveWizardDice(
        ?int $GAME_VERSION,
        #[IntParam(min: 1, max: 16)] int $wizardCard_id,
        #[IntParam(min: 1, max: 10)] int $tier,
    ): void {
        $ActMoveWizardDice = new ActMoveWizardDice($this, $GAME_VERSION);
        $ActMoveWizardDice->act($wizardCard_id, $tier);
    }

    public function actPushTower(
        ?int $GAME_VERSION,
        #[IntParam(min: 1, max: 16)] int $space_id,
        #[IntParam(min: 1, max: 10)] int $tier,
    ): void {
        $ActPushTower = new ActPushTower($this, $GAME_VERSION);
        $ActPushTower->act($space_id, $tier);
    }

    public function actCastSpell(
        ?int $GAME_VERSION,
        #[IntParam(min: 1, max: 8)] int $spell_id,
        #[IntParam(min: 1, max: 16)] ?int $meeple_id,
        #[IntParam(min: 1, max: 10)] ?int $tier,
        #[StringParam(enum: ["counterclockwise", "clockwise"])] ?string $direction,
    ): void {
        $ActCastSpell = new ActCastSpell($this, $GAME_VERSION);
        $ActCastSpell->act($spell_id, $meeple_id, $tier, $direction);
    }

    public function ActSelectSpells(
        ?int $GAME_VERSION,
        #[IntArrayParam(min: 3, max: 3)] array $spell_ids
    ) {
        $ActSelectSpells = new ActSelectSpells($this, $GAME_VERSION);
        $ActSelectSpells->act($spell_ids);
    }

    public function actPass(
        ?int $GAME_VERSION,
    ): void {
        $ActPass = new ActPass($this, $GAME_VERSION);
        $ActPass->act();
    }

    /**
     * Game state arguments, example content.
     *
     * This method returns some additional information that is very specific to the `playerTurn` game state.
     *
     * @return array
     * @see ./states.inc.php
     */

    public function arg_spellSelection(): array
    {
        $StSpellSelection = new StSpellSelection($this);
        return $StSpellSelection->getArgs();
    }

    public function st_spellSelection(): void
    {
        $StSpellSelection = new StSpellSelection($this);
        $StSpellSelection->enter();
    }

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

    public function st_playerTurn(): void
    {
        $StPlayerTurn = new StPlayerTurn($this);
        $StPlayerTurn->enter();
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
        $WizardManager = new WizardManager($this);
        $PotionManager = new PotionManager($this);

        $ScoreManager = new ScoreManager($this);
        $higherScore = $ScoreManager->getHigherScore();

        $maxScore = $WizardManager->getRavenskeepGoal() + $PotionManager->getPotionsGoal();
        $progression = ($higherScore / $maxScore) * 100;

        return round($progression);
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
        $SpellManager = new SpellManager($this);

        /**  @disregard P1014*/
        $GAME_VERSION = (int) $this->gamestate->table_globals[300];

        $gamedatas = [
            "GAME_VERSION" => $GAME_VERSION,
            "SPELLS" => $this->SPELLS,
            "isSolo" => $this->isSolo(),
            "players" => $this->getCollectionFromDb("SELECT `player_id` `id`, `player_score` `score`, `turns_played` FROM `player`"),
            "diceFace" => $this->globals->get(G_ROLL, 3),
            "towerCards" => $TowerManager->getCardsInLocation("space"),
            "wizardCards" => $WizardManager->getCardsInLocation("space"),
            "potionCards" => $PotionManager->getCargos(),
            "moveDeckCount" => $MoveManager->getDeckCount(),
            "moveDiscard" => $MoveManager->getDiscard(),
            "moveDiscardCount" => $MoveManager->countCardsInDiscard(),
            "hand" => $MoveManager->getPlayerHand($current_player_id),
            "spellCards" => $SpellManager->getAll(),
            "tierCounts" => $TowerManager->getTierCounts(),
            "ravenskeepCounts" => $WizardManager->getRavenskeepCounts(),
            "ravenskeepGoal" => $WizardManager->getRavenskeepGoal(),
            "finalTurn" => $this->globals->get(G_FINAL_TURN, 0),
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

        $SpellManager = new SpellManager($this);
        $SpellManager->setupCards();

        $this->globals->set(G_REROLLS, 0);
        $this->globals->set(G_ROLL, 3);
        $this->globals->set(G_TURN_MOVE, 0);
        $this->globals->set(G_FINAL_TURN, 0);

        $isSolo = count($players) === 1;

        foreach ($players as $player_id => $player) {
            $this->initStat("player", STAT_WIZARDS_RAVENSKEEP, 0, $player_id);
            $this->initStat("player", STAT_WIZARDS_IMPRISONED, 0, $player_id);
            $this->initStat("player", STAT_MOVES_DISCARDED, 0, $player_id);

            if ($isSolo) {
                if ($this->tableOptions->get(OPT_SPELLS_SOLO) === 1) {
                    $this->initStat("player", STAT_SPELLS_CASTED, 0, $player_id);
                    $this->initStat("player", STAT_POTIONS_USED, 0, $player_id);
                }

                continue;
            }


            $this->initStat("player", STAT_SPELLS_CASTED, 0, $player_id);
            $this->initStat("player", STAT_POTIONS_USED, 0, $player_id);
            $this->initStat("player", STAT_POTIONS_FILLED, 0, $player_id);
        }
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
    protected function zombieTurn(array $state, int $player_id): void
    {
        $state_name = $state["name"];

        if ($state["type"] === "activeplayer") {
            $this->gamestate->nextState(TR_NEXT_PLAYER);
            return;
        }

        throw new \feException("Zombie mode not supported at this game state: \"{$state_name}\".");
    }

    public function debug_enterRavenskeep(): void
    {
        $player_id = (int) $this->getCurrentPlayerId();
        $Wizard = new Wizard($this, 8);
        $Wizard->enterRavenskeep($player_id);
    }

    public function debug_ravenskeepAll(): void
    {
        $WizardManager = new WizardManager($this);
        $WizardManager->deck->moveAllCardsInLocation("space", "ravenskeep");
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

    public function debug_checkGameEnd(): void
    {
        $StBetweenPlayers = new StBetweenPlayers($this);
        $StBetweenPlayers->checkGameEnd();
    }

    public function debug_autoreshuffle(): void
    {
        $this->move_cards->moveAllCardsInLocation("deck", "discard");
        $this->move_cards->pickCard("deck", $this->getActivePlayerId());
    }

    public function debug_fillPotion(): void
    {
        $player_id = (int) $this->getCurrentPlayerId();
        $PotionManager = new PotionManager($this);
        $PotionManager->fillPotion($player_id);
    }

    public function debug_castSpell(): void
    {
        $ActCastSpell = new ActCastSpell($this, null);
        $ActCastSpell->act(7, 2, 1);
    }

    public function debug_finalTurn(): void
    {
        $NotifManager = new NotifManager($this);
        $NotifManager->all(
            "finalTurn",
            clienttranslate('This is the last round'),
            [],
        );

        $player_id = (int) $this->getActivePlayerId();
        $this->globals->set(G_FINAL_TURN, $this->getTurnsPlayed($player_id) + 1);
    }
}
