interface StateManager {
  game: WanderingTowersGui;
  stateName: StateName;
  statusBar: WanderingTowersGui["statusBar"];
  wtw: WanderingTowersGui["wtw"];
  enter(): void;
}

type StateName = "playerTurn" | "rerollDice" | "client_playMove";

class StateManager implements StateManager {
  constructor(game: WanderingTowersGui, stateName: StateName) {
    this.game = game;
    this.stateName = stateName;
    this.wtw = this.game.wtw;
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
        this.game.performAction("actRerollDice");
      },
      {}
    );

    this.statusBar.addActionButton(
      _("Accept"),
      () => {
        this.game.performAction("actAcceptRoll");
      },
      {}
    );
  }
}

class StPlayerTurn extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "playerTurn");
  }

  enter() {
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

class StPlayMove extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_playMove");
  }

  enter() {
    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(true);
  }

  leave() {
    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(false);
  }
}
