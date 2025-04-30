define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter",
  "ebg/stock",
  `${g_gamethemeurl}modules/js/bga-zoom.js`,
  `${g_gamethemeurl}modules/js/bga-help.js`,
  `${g_gamethemeurl}modules/js/bga-cards.js`,
], function (dojo, declare) {
  return declare(
    "bgagame.wanderingtowers",
    ebg.core.gamegui,
    new WanderingTowers()
  );
});
