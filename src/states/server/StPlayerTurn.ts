class StPlayerTurn extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "playerTurn");
  }

  enter() {
    super.enter();

    this.statusBar.addActionButton(
      "play movement",
      () => {
        const stPlayMove = new StPlayMove(this.game);
        stPlayMove.set();
      },
      {}
    );
  }
}
