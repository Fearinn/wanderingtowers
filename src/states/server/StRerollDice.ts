class StRerollDice extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "rerollDice");
  }

  enter() {
    super.enter();

    this.statusBar.addActionButton(
      _("Reroll"),
      () => {
        this.game.performAction("actRerollDice");
      },
      {}
    );

    this.statusBar.addActionButton(
      _("Accept"),
      () => {
        this.game.performAction("actAcceptRoll");
      },
      { classes: ["wtw_positiveButton"] }
    );
  }
}