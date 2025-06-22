<?php

$this->SPACES = [
    1 => [
        "raven" => true,
        "type" => "raven",
        "setupWizardCount" => 0,
        "landscape" => 1,
    ],
    2 => [
        "raven" => false,
        "setupWizardCount" => 3,
        "landscape" => 1,
    ],
    3 => [
        "raven" => false,
        "setupWizardCount" => 3,
        "landscape" => 1,
    ],
    4 => [
        "raven" => false,
        "setupWizardCount" => 3,
        "landscape" => 1,
    ],
    5 => [
        "raven" => true,
        "type" => "raven",
        "setupWizardCount" => 2,
        "landscape" => 2,
    ],
    6 => [
        "raven" => false,
        "setupWizardCount" => 2,
        "landscape" => 2,
    ],
    7 => [
        "raven" => false,
        "setupWizardCount" => 2,
        "landscape" => 2,
    ],
    8 => [
        "raven" => false,
        "setupWizardCount" => 1,
        "landscape" => 2,
    ],
    9 => [
        "raven" => true,
        "type" => "raven",
        "setupWizardCount" => 1,
        "landscape" => 3,
    ],
    10 => [
        "raven" => false,
        "setupWizardCount" => 1,
        "landscape" => 3,
    ],
    11 => [
        "raven" => false,
        "setupWizardCount" => 1,
        "landscape" => 3,
    ],
    12 => [
        "raven" => false,
        "setupWizardCount" => 0,
        "landscape" => 3,
    ],
    13 => [
        "raven" => true,
        "type" => "raven",
        "setupWizardCount" => 0,
        "landscape" => 4,
    ],
    14 => [
        "raven" => false,
        "setupWizardCount" => 0,
        "landscape" => 4,
    ],
    15 => [
        "raven" => false,
        "setupWizardCount" => 0,
        "landscape" => 4,
    ],
    16 => [
        "raven" => false,
        "setupWizardCount" => 0,
        "landscape" => 4,
    ],
];

$this->TOWERS = [
    1 => [
        "raven" => true,
        "ravenskeep" => true,
        "type" => "ravenskeep",
    ],
    2 => [
        "raven" => true,
        "type" => "raven",
    ],
    3 => [
        "raven" => false,
        "type" => "normal",
    ],
    4 => [
        "raven" => true,
        "type" => "raven",
    ],
    5 => [
        "raven" => false,
        "type" => "normal",
    ],
    6 => [
        "raven" => true,
        "type" => "raven",
    ],
    7 => [
        "raven" => false,
        "type" => "normal",
    ],
    8 => [
        "raven" => true,
        "type" => "raven",
    ],
    9 => [
        "raven" => false,
        "type" => "normal",
    ],
    10 => [
        "raven" => true,
        "type" => "raven",
    ],
];

$this->SETUP_COUNTS = [
    1 => [
        "wizards" => 12,
        "potions" => 6,
    ],
    2 => [
        "wizards" => 5,
        "potions" => 6,
    ],
    3 => [
        "wizards" => 4,
        "potions" => 5,
    ],
    4 => [
        "wizards" => 4,
        "potions" => 5,
    ],
    5 => [
        "wizards" => 3,
        "potions" => 4,
    ],
    6 => [
        "wizards" => 3,
        "potions" => 4,
    ],
];

$this->MOVES = [
    1 => [
        "type" => "wizard",
        "tower" => 0,
        "wizard" => 1,
        "count" => 4,
    ],
    2 => [
        "type" => "wizard",
        "tower" => 0,
        "wizard" => 2,
        "count" => 4,
    ],
    3 => [
        "type" => "wizard",
        "tower" => 0,
        "wizard" => 3,
        "count" => 4,
    ],
    4 => [
        "type" => "wizard",
        "tower" => 0,
        "wizard" => 4,
        "count" => 4,
    ],
    5 => [
        "type" => "wizard",
        "tower" => 0,
        "wizard" => 5,
        "count" => 4,
    ],
    6 => [
        "type" => "tower",
        "tower" => 1,
        "wizard" => 0,
        "count" => 4,
    ],
    7 => [
        "type" => "tower",
        "tower" => 2,
        "wizard" => 0,
        "count" => 4,
    ],
    8 => [
        "type" => "tower",
        "tower" => 3,
        "wizard" => 0,
        "count" => 4,
    ],
    9 => [
        "type" => "tower",
        "tower" => 4,
        "wizard" => 0,
        "count" => 4,
    ],
    10 => [
        "type" => "tower",
        "tower" => 5,
        "wizard" => 0,
        "count" => 4,
    ],
    11 => [
        "type" => "both",
        "tower" => 1,
        "wizard" => 1,
        "count" => 3,
    ],
    12 => [
        "type" => "both",
        "tower" => 2,
        "wizard" => 2,
        "count" => 3,
    ],
    13 => [
        "type" => "both",
        "tower" => 3,
        "wizard" => 3,
        "count" => 3,
    ],
    14 => [
        "type" => "both",
        "tower" => 4,
        "wizard" => 4,
        "count" => 3,
    ],
    15 => [
        "type" => "both",
        "tower" => 5,
        "wizard" => 1,
        "count" => 6,
    ],
    16 => [
        "type" => "both",
        "tower" => 4,
        "wizard" => 2,
        "count" => 6,
    ],
    17 => [
        "type" => "both",
        "tower" => 2,
        "wizard" => 4,
        "count" => 6,
    ],
    18 => [
        "type" => "both",
        "tower" => 1,
        "wizard" => 5,
        "count" => 6,
    ],
    19 => [
        "type" => "both",
        "tower" => "dice",
        "wizard" => "dice",
        "diceCount" => 1,
        "count" => 6,
    ],
    20 => [
        "type" => "tower",
        "tower" => "dice",
        "wizard" => 0,
        "diceCount" => 2,
        "count" => 3,
    ],
    21 => [
        "type" => "wizard",
        "tower" => 0,
        "wizard" => "dice",
        "diceCount" => 2,
        "count" => 3,
    ],
    22 => [
        "type" => "tower",
        "tower" => "dice",
        "wizard" => 0,
        "diceCount" => 3,
        "count" => 1,
    ],
    23 => [
        "type" => "wizard",
        "tower" => 0,
        "wizard" => "dice",
        "diceCount" => 3,
        "count" => 1,
    ],
];

$this->SPELLS = [
    1 => [
        "tr_name" => clienttranslate("Advance a Wizard"),
        "cost" => 2,
        "type" => "wizard",
        "steps" => 1,
    ],
    2 => [
        "tr_name" => clienttranslate("Headwind for a Wizard"),

        "cost" => 2,
        "type" => "wizard",
        "steps" => -1,
    ],
    3 => [
        "tr_name" => clienttranslate("Advance a Tower"),

        "cost" => 1,
        "type" => "tower",
        "steps" => 2,
    ],
    4 => [
        "tr_name" => clienttranslate("Headwind for a Tower"),

        "cost" => 1,
        "type" => "tower",
        "steps" => -2,
    ],
    5 => [
        "tr_name" => clienttranslate("Nudge a Ravenskeep"),
        "cost" => 2,
        "type" => "auto",
        "steps" => 0,
    ],
    6 => [
        "tr_name" => clienttranslate("Swap a Tower"),
        "cost" => 1,
        "type" => "tower",
        "steps" => 2,
    ],
    // 7 => [
    //     "tr_name" => clienttranslate("Free a Wizard"),
    //     "cost" => 2,
    //     "type" => "tower",
    //     "steps" => 0,
    // ],
];
