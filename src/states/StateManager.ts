interface StateManager {
  game: WanderingTowersGui;
  stateName: StateName;
  statusBar: StatusBar;
  wtw: WanderingTowersGui["wtw"];
  enter(args?: object): void;
}

type StateName =
  | "playerTurn"
  | "rerollDice"
  | "afterRoll"
  | "client_playMove"
  | "client_pickMoveSide"
  | "client_pickMoveWizard"
  | "client_pickMoveTower"
  | "client_pickMoveTier"
  | "client_pickPushTower"
  | "client_castSpell"
  | "client_pickSpellWizard"
  | "client_pickSpellTower"
  | "client_pickSpellTier"
  | "client_pickSpellDirection"
  | "spellSelection";

class StateManager implements StateManager {
  constructor(game: WanderingTowersGui, stateName: StateName) {
    this.game = game;
    this.stateName = stateName;
    this.statusBar = this.game.statusBar;
    this.wtw = this.game.wtw;
  }

  enter(args?: object): void {
    if (this.stateName.includes("client_")) {
      this.game.statusBar.addActionButton(
        _("cancel"),
        () => {
          this.game.restoreServerGameState();
        },
        { color: "alert" }
      );
    }
  }

  leave() {}
}

interface MovableMeeples {
  [moveCard_id: number]: {
    wizard: WizardCard[];
    tower: TowerCard[];
  };
}

interface SpellableMeeples {
  [spell_id: number]: {
    wizard: WizardCard[];
    tower: TowerCard[];
  };
}
