<?php

declare(strict_types=1);

/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * WanderingTowers implementation : © Matheus Gomes matheusgomesforwork@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
require "modules/php/constants.inc.php";

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
	ST_SPELL_SELECTION => [
		"name" => "spellSelection",
		"description" => clienttranslate('${actplayer} must pick 3 spells to use during the game'),
		"descriptionmyturn" => clienttranslate('${you} must pick 3 spells to use during the game'),
		"type" => "activeplayer",
		"args" => "arg_spellSelection",
		"action" => "st_spellSelection",
		"possibleactions" => [
			"actSelectSpells",
		],
		"transitions" => [
			TR_START_GAME => ST_PLAYER_TURN,
		],
	],
	ST_PLAYER_TURN => [
		"name" => "playerTurn",
		"description" => clienttranslate('${actplayer} must perform an action'),
		"descriptionmyturn" => clienttranslate('${you} must perform an action'),
		"type" => "activeplayer",
		"args" => "arg_playerTurn",
		"action" => "st_playerTurn",
		"possibleactions" => [
			"actMoveWizard",
			"actMoveTower",
			"actRollDice",
			"actPushTower",
			"actCastSpell",
			"actPass",
		],
		"transitions" => [
			TR_NEXT_ACTION => ST_PLAYER_TURN,
			TR_NEXT_PLAYER => ST_BETWEEN_PLAYERS,
			TR_REROLL_DICE => ST_REROLL_DICE,
			TR_PASS => ST_BETWEEN_PLAYERS,
		],
		"updateGameProgression" => true,
	],

	ST_BETWEEN_PLAYERS => [
		"name" => "betweenPlayers",
		"description" => clienttranslate('...'),
		"descriptionmyturn" => clienttranslate('...'),
		"type" => "game",
		"action" => "st_betweenPlayers",
		"transitions" => [
			TR_NEXT_PLAYER => ST_PLAYER_TURN,
			TR_GAME_END => ST_GAME_END,
		],
	],

	ST_AFTER_ROLL => [
		"name" => "afterRoll",
		"description" => clienttranslate('${actplayer} must move a ${wizard_or_tower}'),
		"descriptionmyturn" => clienttranslate('${you} must move a ${wizard_or_tower}'),
		"type" => "activeplayer",
		"args" => "arg_afterRoll",
		"possibleactions" => [
			"actMoveTower",
			"actMoveWizard"
		],
		"transitions" => [
			TR_NEXT_ACTION => ST_PLAYER_TURN,
			TR_NEXT_PLAYER => ST_BETWEEN_PLAYERS,
		],
	],

	ST_REROLL_DICE => [
		"name" => "rerollDice",
		"description" => clienttranslate('${actplayer} may reroll the die'),
		"descriptionmyturn" => clienttranslate('${you} may reroll the die'),
		"type" => "activeplayer",
		"action" => "st_rerollDice",
		"possibleactions" => [
			"actRerollDice",
			"actAcceptRoll"
		],
		"transitions" => [
			TR_REROLL_DICE => ST_REROLL_DICE,
			TR_AFTER_ROLL => ST_AFTER_ROLL,
			TR_NEXT_PLAYER => ST_BETWEEN_PLAYERS,
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
