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
  | "client_pickMoveWizard"
  | "client_pickMoveTower";

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
