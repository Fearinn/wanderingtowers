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

    const towerCardManager = new CardManager<BgaCard>(this, {
      getId: (card) => {
        return `wtw_towerCard-${card.id}`;
      },
      setupDiv: (card, element) => {
        const towerCard = new TowerCard(this, card);
        towerCard.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {},
    });

    const wizardCardManager = new CardManager<WizardCardBase>(this, {
      getId: (card) => {
        return `wtw_wizardCard-${card.id}`;
      },
      selectedCardClass: "wtw_wizard-selected",
      setupDiv: (card, element) => {
        const wizardCard = new WizardCard(this, card);
        wizardCard.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {},
    });

    const moveCardManager = new CardManager<MoveCardBase>(this, {
      cardHeight: 100,
      cardWidth: 146,
      selectedCardClass: "wtw_move-selected",
      getId: (card) => {
        return `wtw_moveCard-${card.id}`;
      },
      setupDiv: (card, element) => {
        const moveCard = new MoveCard(this, card);
        moveCard.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {
        const moveCard = new MoveCard(this, card);
        moveCard.setupFrontDiv(element);
      },
      setupBackDiv: (card, element) => {
        const moveCard = new MoveCard(this, card);
        moveCard.setupBackDiv(element);
      },
    });

    const towerStocks = {};
    const wizardStocks = {
      spaces: {},
    };
    for (let space_id = 1; space_id <= 16; space_id++) {
      towerStocks[space_id] = new CardStock<BgaCard>(
        towerCardManager,
        document.getElementById(`wtw_spaceTowers-${space_id}`)
      );

      wizardStocks.spaces[space_id] = new WizardSpaceStock(
        this,
        wizardCardManager,
        space_id
      );
    }

    const moveStocks = {
      hand: new MoveHandStock(this, moveCardManager),
      deck: new Deck(moveCardManager, document.getElementById("wtw_deck"), {
        counter: {
          position: "top",
          hideWhenEmpty: true,
          extraClasses: "text-shadow",
        },
      }),
      discard: new CardStock(
        moveCardManager,
        document.getElementById("wtw_discard")
      ),
    };

    this.wtw = {
      managers: {
        zoom: zoomManager,
        dice: diceManager,
        moves: moveCardManager,
        towers: towerCardManager,
        wizards: wizardCardManager,
      },
      stocks: {
        dice: diceStock,
        towers: towerStocks,
        wizards: wizardStocks,
        moves: moveStocks,
      },
      globals: {},
    };

    gamedatas.towerCards.forEach((card) => {
      const towerCard = new TowerCard(this, card);
      towerCard.setup();
    });

    gamedatas.moveDeck.forEach((card) => {
      const moveCard = new MoveCard(this, card);
      moveCard.setup();
    });

    gamedatas.wizardCards.forEach((card) => {
      const wizardCard = new WizardCard(this, card);
      wizardCard.setup();
    });

    moveStocks.hand.setup(gamedatas.hand);

    this.setupNotifications();
  }

  public addConfirmationButton(selection: string, callback: () => void) {
    return this.statusBar.addActionButton(
      this.format_string_recursive(_("confirm ${selection}"), {
        selection: _(selection),
      }),
      callback,
      { id: "wtw_confirmationButton" }
    );
  }

  public performAction(action: ActionName, args = {}, options = {}) {
    this.bgaPerformAction(action, args, options);
  }

  public onEnteringState(stateName: StateName, args?: object): void {
    if (!this.isCurrentPlayerActive()) {
      return;
    }

    switch (stateName) {
      case "playerTurn":
        new StPlayerTurn(this).enter();
        break;

      case "client_playMove":
        new StPlayMove(this).enter();
        break;

      case "client_pickMoveSide":
        new StPickMoveSide(this).enter();
        break;

      case "client_pickMoveWizard":
        new StPickMoveWizard(this).enter();
        break;

      case "rerollDice":
        new StRerollDice(this).enter();
        break;
    }
  }

  public onLeavingState(stateName: StateName): void {
    switch (stateName) {
      case "client_playMove":
        new StPlayMove(this).leave();
        break;

      case "client_pickMoveSide":
        new StPickMoveSide(this).leave();
        break;

      case "client_pickMoveWizard":
        new StPickMoveWizard(this).leave();
        break;
    }
  }
  public onUpdateActionButtons(stateName: string, args: object): void {}

  public setupNotifications(): void {
    this.bgaSetupPromiseNotifications({
      handlers: [new NotificationManager(this)],
    });
  }
}
