define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter",
  `${g_gamethemeurl}modules/js/libs/bga-dice.js`,
], function (dojo, declare, counter, gamegui, dice) {
  return declare(
    "bgagame.wanderingtowers",
    ebg.core.gamegui,
    new WanderingTowers()
  );
});
