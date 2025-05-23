class StPlayerTurn extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "playerTurn");
  }

  enter() {
    super.enter();

    this.statusBar.addActionButton(
      "play movement",
      () => {
        this.game.setClientState("client_playMove", {
          descriptionmyturn: _("${you} must pick a movement card"),
        });
      },
      {}
    );
  }
}