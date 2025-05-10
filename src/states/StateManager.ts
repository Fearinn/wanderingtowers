interface StateManager {
  game: WanderingTowersGui;
  stateName: StateName;
  statusBar: WanderingTowersGui["statusBar"];
  wtw: WanderingTowersGui["wtw"];
  enter(): void;
}

type StateName =
  | "playerTurn"
  | "rerollDice"
  | "client_playMove"
  | "client_pickMoveSide"
  | "client_pickWizard"
  | "client_pickTower";

class StateManager implements StateManager {
  constructor(game: WanderingTowersGui, stateName: StateName) {
    this.game = game;
    this.stateName = stateName;
    this.wtw = this.game.wtw;
    this.statusBar = this.game.statusBar;
  }

  enter() {
    if (this.stateName.includes("client_")) {
      this.statusBar.addActionButton(
        _("cancel"),
        () => {
          this.game.restoreServerGameState();
        },
        { color: "alert" }
      );
    }
  }
}

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
      {}
    );
  }
}

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

class StPlayMove extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_playMove");
  }

  enter() {
    super.enter();

    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(true);
  }

  leave() {
    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(false);
  }
}

class StPickMoveSide extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickMoveSide");
  }

  enter() {
    super.enter();

    this.statusBar.addActionButton(
      _("wizard"),
      () => {
        this.game.setClientState("client_pickWizard", {
          descriptionmyturn: _("${you} must pick a wizard to move"),
        });
      },
      {}
    );

    this.statusBar.addActionButton(
      _("tower"),
      () => {
        this.game.setClientState("client_pickTower", {
          descriptionmyturn: _("${you} must pick a tower to move"),
        });
      },
      {}
    );
  }
}
