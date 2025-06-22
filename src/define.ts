define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter",
  `${g_gamethemeurl}modules/js/libs/bga-dice.js`,
  getLibUrl("bga-autofit", "1.x"),
], function (dojo, declare, counter, gamegui, dice, BgaAutoFit) {
  (window as any).BgaAutoFit = BgaAutoFit;

  return declare(
    "bgagame.wanderingtowers",
    ebg.core.gamegui,
    new WanderingTowers()
  );
});
