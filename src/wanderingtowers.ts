// @ts-ignore
WanderingTowersGui = (function () {
  // this hack required so we fake extend Game
  function WanderingTowersGui() {}
  return WanderingTowersGui;
})();

// Note: it does not really extend it in es6 way, you cannot call super you have to use dojo way
class WanderingTowers extends WanderingTowersGui {
  // @ts-ignore
  constructor() {}

  public setup(gamedatas: WanderingTowersGamedatas) {
    const zoomManager = new ZoomManager({
      element: document.getElementById("wtw_gameArea"),
      localStorageZoomKey: "wanderingtowers-zoom",
    });

    const diceManager = new DiceManager(this, {
      dieTypes: {
        die: new Die(),
      },
      perspective: 0,
    });

    const diceStock = new DiceStock(
      diceManager,
      document.getElementById("wtw_dice")
    );

    this.wtw = {
      managers: {
        zoom: zoomManager,
        dice: diceManager,
      },
      stocks: {
        dice: diceStock,
      },
    };

    diceStock.addDie({
      id: 1,
      type: "die",
      face: 3,
    });

    this.setupNotifications();
  }

  performAction(action: ActionName, args = {}, options = {}) {
    this.bgaPerformAction(action, args, options);
  }

  public onEnteringState(stateName: StateName, args?: object): void {
    if (!this.isCurrentPlayerActive()) {
      return;
    }

    switch (stateName) {
      case "rerollDice":
        new StRerollDice(this).enter();
    }
  }
  public onLeavingState(stateName: string): void {}
  public onUpdateActionButtons(stateName: string, args: any): void {}

  public setupNotifications(): void {
    this.bgaSetupPromiseNotifications();
  }

  public notif_rollDie(args: { face: number }): void {
    const { face } = args;

    this.wtw.stocks.dice.rollDie({ id: 1, type: "die", face });
  }
}
