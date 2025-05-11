<?php

declare(strict_types=1);

use const Bga\Games\WanderingTowers\TR_NEXT_PLAYER;
use const Bga\Games\WanderingTowers\TR_REROLL_DICE;

/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * WanderingTowers implementation : © Matheus Gomes matheusgomesforwork@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

if (false) {
	/** @var wanderingtowers $game */
}

if (!defined("ST_GAME_END")) {
	define("ST_SETUP", 1);
	define("ST_PLAYER_TURN", 2);
	define("ST_BETWEEN_PLAYERS", 3);
	define("ST_REROLL_DICE", 4);
	define("ST_GAME_END", 99);
}

$machinestates = [
	ST_SETUP => [
		"name" => "gameSetup",
		"description" => "",
		"type" => "manager",
		"action" => "stGameSetup",
		"transitions" => [
			"" => 2,
		],
	],
	ST_PLAYER_TURN => [
		"name" => "playerTurn",
		"description" => clienttranslate('${actplayer} may play a movement card or a spell'),
		"descriptionmyturn" => clienttranslate('${you} may play a movement card or a spell'),
		"type" => "activeplayer",
		"possibleactions" => ["actMoveWizard", "actPassTurn"],
		"transitions" => [
			TR_NEXT_PLAYER => ST_BETWEEN_PLAYERS,
			TR_REROLL_DICE => ST_REROLL_DICE,
			"pass" => 2,
		],
	],

	ST_BETWEEN_PLAYERS => [
		"name" => "betweenPlayers",
		"description" => clienttranslate('...'),
		"descriptionmyturn" => clienttranslate('...'),
		"type" => "game",
		"action" => "st_betweenPlayers",
		"transitions" => [
			TR_NEXT_PLAYER => ST_PLAYER_TURN,
		],
	],

	ST_REROLL_DICE => [
		"name" => "rerollDice",
		"description" => clienttranslate('${actplayer} may reroll the die'),
		"descriptionmyturn" => clienttranslate('${you} may reroll the die'),
		"type" => "activeplayer",
		"action" => "st_rerollDice",
		"possibleactions" => ["actRerollDice", "actAcceptRoll"],
		"transitions" => [
			TR_REROLL_DICE => ST_REROLL_DICE,
			TR_NEXT_PLAYER => ST_BETWEEN_PLAYERS,
			"pass" => 2,
		],
	],

	ST_GAME_END => [
		"name" => "gameEnd",
		"description" => clienttranslate("End of game"),
		"type" => "manager",
		"action" => "stGameEnd",
		"args" => "argGameEnd",
	],
];
