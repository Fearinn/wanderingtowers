class StateManager implements StateManager {
  constructor(game: WanderingTowersGui, stateName: StateName) {
    this.game = game;
    this.stateName = stateName;
    this.statusBar = this.game.statusBar;
  }
}

class StRerollDice extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "rerollDice");
  }

  enter() {
    this.statusBar.addActionButton(
      _("Reroll"),
      () => {
        this.game.actRerollDice();
      },
      {}
    );
  };
}
