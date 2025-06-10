
define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter",
  "ebg/stock",
  `${g_gamethemeurl}modules/js/libs/bga-dice.js`,
], function (dojo, declare) {
  return declare(
    "bgagame.wanderingtowers",
    ebg.core.gamegui,
    new WanderingTowers()
  );
});
