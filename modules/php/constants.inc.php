<?php

declare(strict_types=1);

if (!defined("ST_GAME_END")) {
    define("ST_SETUP", 1);
    define("ST_PLAYER_TURN", 2);
    define("ST_BETWEEN_PLAYERS", 3);
    define("ST_REROLL_DICE", 4);
    define("ST_AFTER_ROLL", 5);
    define("ST_GAME_END", 99);

    define("TR_REROLL_DICE", "rerollDice");
    define("TR_NEXT_PLAYER", "nextPlayer");
    define("TR_AFTER_ROLL", "afterRoll");
    define("TR_PASS", "pass");
    define("TR_NEXT_ACTION", "nextAction");
    define("TR_GAME_END", "gameEnd");

    define("G_REROLLS", "rerolls");
    define("G_ROLL", "roll");
    define("G_MOVE", "move");
    define("G_WIZARD", "wizard");
    define("G_TOWER", "tower");
    define("G_TURN_MOVE", "turnMove");
    define("G_FINAL_TURN", "finalTurn");
    define("G_SPELL_CASTED", "spellCasted");

    define("OPT_SPELLS", 100);
    define("OPT_SPELLS_NUMBER", 101);
    define("OPT_SPELLS_SOLO", 102);

    define("STAT_WIZARDS_RAVENSKEEP", "wizardsRavenskeep");
    define("STAT_WIZARDS_IMPRISONED", "wizardsImprisoned");
    define("STAT_SPELLS_CASTED", "spellsCasted");
    define("STAT_POTIONS_FILLED", "potionsFilled");
    define("STAT_POTIONS_USED", "potionsUsed");
    define("STAT_MOVES_DISCARDED", "movesDiscarded");
}
