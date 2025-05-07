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
    });

    const diceStock = new DiceStock(
      diceManager,
      document.getElementById("wtw_dice")
    );

    diceStock.addDie({
      id: 1,
      type: "die",
      face: gamedatas.diceFace,
    });

    const towerCardManager = new CardManager<CardBase>(this, {
      getId: (card) => {
        return `wtw_towerCard-${card.id}`;
      },
      setupDiv: (card, element) => {
        const towerCard = new TowerCard(this, card);
        towerCard.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {},
    });

    const wizardCardManager = new CardManager<CardBase>(this, {
      getId: (card) => {
        return `wtw_wizardCard-${card.id}`;
      },
      setupDiv: (card, element) => {
        const wizardCard = new WizardCard(this, card);
        wizardCard.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {},
    });

    const towerStocks = {};
    const wizardStocks = {};
    for (let space_id = 1; space_id <= 16; space_id++) {
      towerStocks[space_id] = new CardStock<CardBase>(
        towerCardManager,
        document.getElementById(`wtw_spaceTowers-${space_id}`)
      );

      wizardStocks[space_id] = new CardStock<CardBase>(
        wizardCardManager,
        document.getElementById(`wtw_spaceWizards-${space_id}`),
        { sort: sortFunction("type") }
      );
    }

    this.wtw = {
      managers: {
        zoom: zoomManager,
        dice: diceManager,
      },
      stocks: {
        dice: diceStock,
        towers: towerStocks,
        wizards: wizardStocks,
      },
    };

    gamedatas.towerCards.forEach((card) => {
      const towerCard = new TowerCard(this, card);
      towerCard.setup();
    });

    gamedatas.wizardCards.forEach((card) => {
      const wizardCard = new WizardCard(this, card);
      wizardCard.setup();
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
