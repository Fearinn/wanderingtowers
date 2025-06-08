class StPlayerTurn extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "playerTurn");
  }

  enter() {
    super.enter();

    this.statusBar.addActionButton(
      _("play movement"),
      () => {
        const stPlayMove = new StPlayMove(this.game);
        stPlayMove.set();
      },
      {}
    );

    this.statusBar.addActionButton(
      _("advance a tower (discards hand)"),
      () => {
        const stPickAdvanceTower = new StPickAdvanceTower(this.game);
        stPickAdvanceTower.set();
      },
      {}
    );
  }
}
