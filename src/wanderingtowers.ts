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
      zoomLevels: [
        0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5,
      ],
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

    const towerCardManager = new CardManager<TowerCardBase>(this, {
      getId: (card) => {
        return `wtw_towerCard-${card.id}`;
      },
      selectedCardClass: "wtw_tower-selected",
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

    const moveManager = new CardManager<MoveCard>(this, {
      cardHeight: 100,
      cardWidth: 146,
      selectedCardClass: "wtw_move-selected",
      getId: (card) => {
        return `wtw_move-${card.id}`;
      },
      setupDiv: (card, element) => {
        const move = new Move(this, card);
        move.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {
        const move = new Move(this, card);
        move.setupFrontDiv(element);
      },
      setupBackDiv: (card, element) => {
        const move = new Move(this, card);
        move.setupBackDiv(element);
      },
    });

    const potionCardManager = new CardManager<PotionCard>(this, {
      getId: (card) => {
        return `wtw_potionCard-${card.id}`;
      },
      setupDiv: (card, element) => {
        const potionCard = new Potion(this, card);
        potionCard.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {
        const potionCard = new Potion(this, card);
        potionCard.setupFrontDiv(element);
      },
      setupBackDiv: (card, element) => {
        const potionCard = new Potion(this, card);
        potionCard.setupBackDiv(element);
      },
    });

    const towerStocks: TowerStocks = {
      spaces: {},
    };
    const wizardStocks: WizardStocks = {
      spaces: {},
    };
    const counters: Counters = {
      spaces: {},
    };
    for (let space_id = 1; space_id <= 16; space_id++) {
      towerStocks.spaces[space_id] = new TowerSpaceStock(
        this,
        towerCardManager,
        space_id
      );

      wizardStocks.spaces[space_id] = new WizardSpaceStock(
        this,
        wizardCardManager,
        space_id
      );

      counters.spaces[space_id] = new ebg.counter();
      counters.spaces[space_id].create(`wtw_tierCounter-${space_id}`);
      counters.spaces[space_id].setValue(gamedatas.tierCounts[space_id]);
    }

    const moveStocks = {
      hand: new MoveHandStock(this, moveManager),
      deck: new Deck(moveManager, document.getElementById("wtw_moveDeck"), {
        counter: {
          position: "top",
          hideWhenEmpty: true,
          extraClasses: "text-shadow wtw_deckCounter",
        },
      }),
      discard: new CardStock(
        moveManager,
        document.getElementById("wtw_moveDiscard")
      ),
    };

    const potionStocks = {};
    for (let p_id in gamedatas.players) {
      const player_id = Number(p_id);
      const playerPanelElement = this.getPlayerPanelElement(player_id);

      playerPanelElement.insertAdjacentHTML(
        "beforeend",
        `<div id="wtw_potionCargo-${player_id}" class="wtw_potionCargo"></div>`
      );

      potionStocks[player_id] = {
        cargo: new PotionCargoStock(this, potionCardManager, Number(player_id)),
      };
    }

    this.wtw = {
      managers: {
        zoom: zoomManager,
        dice: diceManager,
        moves: moveManager,
        towers: towerCardManager,
        wizards: wizardCardManager,
      },
      stocks: {
        dice: diceStock,
        towers: towerStocks,
        wizards: wizardStocks,
        moves: moveStocks,
        potions: potionStocks,
      },
      counters: counters,
      globals: {},
    };

    gamedatas.towerCards.forEach((card) => {
      const towerCard = new TowerCard(this, card);
      towerCard.setup();
    });

    gamedatas.moveDeck.forEach((card) => {
      const move = new Move(this, card);
      move.setup();
    });

    gamedatas.moveDiscard.forEach((card) => {
      const move = new Move(this, card);
      move.discard();
    });

    gamedatas.wizardCards.forEach((card) => {
      const wizardCard = new WizardCard(this, card);
      wizardCard.setup();
    });

    gamedatas.potionCards.forEach((card) => {
      const potion = new Potion(this, card);
      potion.setup();
    })

    moveStocks.hand.setup(gamedatas.hand);

    this.setupNotifications();
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

      case "client_pickMoveTower":
        new StPickMoveTower(this).enter();
        break;

      case "rerollDice":
        new StRerollDice(this).enter();
        break;

      case "client_pickMoveTier":
        new StPickMoveTier(this).enter();
        break;

      case "afterRoll":
        new StAfterRoll(this).enter(args as args_StAfterRoll);
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

      case "client_pickMoveTower":
        new StPickMoveTower(this).leave();
        break;

      case "client_pickMoveTier":
        new StPickMoveTier(this).leave();
        break;

      case "afterRoll":
        new StAfterRoll(this).leave();
        break;
    }
  }
  public onUpdateActionButtons(stateName: string, args: object): void {}

  public setupNotifications(): void {
    const notificationManager = new NotificationManager(this);
    this.bgaSetupPromiseNotifications({
      handlers: [notificationManager],
    });
  }

  public addConfirmationButton(
    selection: string,
    callback: () => void
  ): HTMLButtonElement {
    return this.statusBar.addActionButton(
      this.format_string_recursive(_("confirm ${selection}"), {
        selection: _(selection),
      }),
      callback,
      { id: "wtw_confirmationButton" }
    );
  }

  public removeConfirmationButton(): void {
    document.getElementById("wtw_confirmationButton")?.remove();
  }

  public performAction(action: ActionName, args = {}, options = {}): void {
    this.bgaPerformAction(action, args, options);
  }

  public getStateName(): StateName {
    return this.gamedatas.gamestate.name;
  }
}
