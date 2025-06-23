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

    const towerManager = new CardManager<TowerCard>(this, {
      getId: (card) => {
        return `wtw_tower-${card.id}`;
      },
      selectedCardClass: "wtw_tower-selected",
      setupDiv: (card, element) => {
        const tower = new Tower(this, card);
        tower.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {},
    });

    const wizardManager = new CardManager<WizardCard>(this, {
      getId: (card) => {
        return `wtw_wizard-${card.id}`;
      },
      selectableCardClass: "wtw_wizard-selectable",
      selectedCardClass: "wtw_wizard-selected",
      setupDiv: (card, element) => {
        const wizard = new Wizard(this, card);
        wizard.setupDiv(element);
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

    const potionManager = new CardManager<PotionCard>(this, {
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

    const spellManager = new CardManager<SpellCard>(this, {
      getId: (card) => {
        return `wtw_spellCard-${card.id}`;
      },
      selectedCardClass: "wtw_spell-selected",
      setupDiv: (card, element) => {
        const spellCard = new Spell(this, card);
        spellCard.setupDiv(element);
      },
      setupFrontDiv: (card, element) => {
        const spellCard = new Spell(this, card);
        spellCard.setupFrontDiv(element);
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
        towerManager,
        space_id
      );

      const spaceElement = document.getElementById(
        `wtw_spaceWizards-${space_id}`
      );
      wizardStocks.spaces[space_id] = {};
      for (let tier = 0; tier <= 10; tier++) {
        spaceElement.insertAdjacentHTML(
          "beforeend",
          `<div id="wtw_wizardTier-${space_id}-${tier}" class="wtw_wizardTier" data-tier=${tier}></div>`
        );

        wizardStocks.spaces[space_id][tier] = new WizardSpaceStock(
          this,
          wizardManager,
          space_id,
          tier
        );
      }

      const tierCount = gamedatas.tierCounts[space_id];
      counters.spaces[space_id] = new ebg.counter();
      counters.spaces[space_id].create(`wtw_tierCounter-${space_id}`);
      counters.spaces[space_id].setValue(tierCount);
      this.addTooltipHtml(
        `wtw_tierCounter-${space_id}`,
        `<span class="wtw_tooltipText">${_(
          "number of towers at this space"
        )}</span>`
      );
    }

    if (this.getGameUserPreference(101) == 0) {
      const moveHandElement = document.getElementById("wtw_moveHand");
      document
        .getElementById("wtw_gameArea")
        .insertAdjacentElement("afterbegin", moveHandElement);
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
        document.getElementById("wtw_moveDiscard"),
        { sort: sortFunction("location_arg") }
      ),
    };

    for (const p_id in gamedatas.players) {
      const player_id = Number(p_id);

      this.getPlayerPanelElement(player_id).insertAdjacentHTML(
        "beforeend",
        `<div id="wtw_moveVoid-${player_id}" class="wtw_moveVoid"></div>`
      );

      moveStocks[player_id] = {
        hand: new VoidStock(
          moveManager,
          document.getElementById(`wtw_moveVoid-${player_id}`)
        ),
      };
    }

    const potionStocks = {
      void: new VoidStock(
        potionManager,
        document.getElementById("wtw_potionVoid")
      ),
    };
    for (let p_id in gamedatas.players) {
      const player_id = Number(p_id);
      const playerPanelElement = this.getPlayerPanelElement(player_id);

      playerPanelElement.insertAdjacentHTML(
        "beforeend",
        `<div id="wtw_ravenskeepCounter-${player_id}" class="wtw_whiteblock wtw_ravenskeepCounter">
          <div id="wtw_ravenskeepCounterIcon-${player_id}" class="wtw_ravenskeepCounterIcon"></div>
            <div class="wtw_ravenskeepCountContainer">
            <span id="wtw_ravenskeepCount-${player_id}" class="wtw_ravenskeepCount">0</span>
            <span id="wtw_ravenskeepGoal-${player_id}" class="wtw_ravenskeepGoal">/${gamedatas.ravenskeepGoal}</span>
          </div>
          <div id="wtw_panelWizard-${player_id}" class="wtw_card wtw_wizard wtw_wizard-panel"></div>
        </div>
        <div id="wtw_potionCargo-${player_id}" class="wtw_whiteblock wtw_potionCargo"></div>`
      );

      this.addTooltipHtml(
        `wtw_ravenskeepCounter-${player_id}`,
        `<span class="wtw_tooltipText">${_(
          "number of wizards in the Ravenskeep"
        )}</span>`
      );

      this.addTooltipHtml(
        `wtw_potionCargo-${player_id}`,
        `<span class="wtw_tooltipText">${_("potions remaining")}</span>`
      );

      counters[player_id] = {
        ...counters[player_id],
        ravenskeep: new ebg.counter(),
      };
      counters[player_id].ravenskeep.create(`wtw_ravenskeepCount-${player_id}`);
      counters[player_id].ravenskeep.setValue(
        gamedatas.ravenskeepCounts[player_id]
      );

      potionStocks[player_id] = {
        cargo: new PotionCargoStock(this, potionManager, player_id),
      };
    }

    const spellStocks = {
      table: new CardStock<SpellCard>(
        spellManager,
        document.getElementById(`wtw_spells`),
        {
          sort: sortFunction("type_arg"),
        }
      ),
    };

    this.wtw = {
      managers: {
        zoom: zoomManager,
        dice: diceManager,
        moves: moveManager,
        towers: towerManager,
        wizards: wizardManager,
        spells: spellManager,
      },
      stocks: {
        dice: diceStock,
        towers: towerStocks,
        wizards: wizardStocks,
        moves: moveStocks,
        potions: potionStocks,
        spells: spellStocks,
      },
      counters: counters,
      globals: {},
      material: {
        spells: {
          1: {
            name: _("Advance a Wizard"),
            description: _("Move any 1 visible wizard 1 space clockwise"),
          },
          2: {
            name: _("Headwind for a Wizard"),
            description: _(
              "Move any 1 visible wizard 1 space counterclockwise"
            ),
          },
          3: {
            name: _("Advance a Tower"),
            description: _(
              "Move any 1 tower (and everything atop it) 2 spaces clockwise"
            ),
          },
          4: {
            name: _("Headwind for a Tower"),
            description: _(
              "Move any 1 tower (and everything atop it) 2 spaces counterclockwise."
            ),
          },
          5: {
            name: _("Nudge a Ravenskeep"),
            description: _(
              "Move Ravenskeep clockwise or counterclockwise to the next empty space or empty tower top, whichever it encounters first in that direction"
            ),
          },
          6: {
            name: _("Swap a Tower"),
            description: _(
              "Swap the topmost tower (and wizards atop them) in 2 spaces"
            ),
          },
          7: {
            name: _("Free a Wizard"),
            description: _(
              "Lift any 1 tower to free 1 of your wizards from beneath it, placing the wizard on top of the stack"
            ),
          },
        },
      },
    };

    gamedatas.towerCards.forEach((card) => {
      const tower = new Tower(this, card);
      tower.setup();
    });

    gamedatas.wizardCards.forEach((card) => {
      const wizard = new Wizard(this, card);
      wizard.setup();
    });

    gamedatas.potionCards.forEach((card) => {
      const potion = new Potion(this, card);
      potion.setup();
    });

    gamedatas.moveDeck.forEach((card) => {
      const move = new Move(this, card);
      move.setup();
    });

    gamedatas.moveDiscard.forEach((card) => {
      const move = new Move(this, card);
      move.discard();
    });

    moveStocks.hand.setup(gamedatas.hand);

    gamedatas.spellCards.forEach((spellCard) => {
      const spell = new Spell(this, spellCard);
      spell.setup();
    });

    this.setupNotifications();
    BgaAutoFit.init();
    this.initAutoHideWizards();
  }

  public onEnteringState(stateName: StateName, args?: any): void {
    if (!this.isCurrentPlayerActive()) {
      return;
    }

    switch (stateName) {
      case "playerTurn":
        new StPlayerTurn(this).enter(args.args);
        break;

      case "client_playMove":
        new StPlayMove(this).enter(args.args);
        break;

      case "client_pickMoveSide":
        new StPickMoveSide(this).enter();
        break;

      case "client_pickMoveWizard":
        new StPickMoveWizard(this).enter(args.args);
        break;

      case "client_pickMoveTower":
        new StPickMoveTower(this).enter(args.args);
        break;

      case "rerollDice":
        new StRerollDice(this).enter();
        break;

      case "client_pickMoveTier":
        new StPickMoveTier(this).enter();
        break;

      case "afterRoll":
        new StAfterRoll(this).enter(args.args);
        break;

      case "client_pickPushTower":
        new StPickPushTower(this).enter(args.args);
        break;

      case "client_castSpell":
        new StCastSpell(this).enter(args.args);
        break;

      case "client_pickSpellWizard":
        new StPickSpellWizard(this).enter(args.args);
        break;

      case "client_pickSpellTower":
        new StPickSpellTower(this).enter(args.args);
        break;

      case "client_pickSpellTier":
        new StPickSpellTier(this).enter();
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

      case "client_pickPushTower":
        new StPickPushTower(this).leave();
        break;

      case "client_castSpell":
        new StCastSpell(this).leave();
        break;

      case "client_pickSpellWizard":
        new StPickSpellWizard(this).leave();
        break;

      case "client_pickSpellTower":
        new StPickSpellTower(this).leave();
        break;

      case "client_pickSpellTier":
        new StPickSpellTier(this).leave();
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

  public performAction(
    action: ActionName,
    args = {},
    options = { lock: true, checkAction: true }
  ): void {
    this.bgaPerformAction(action, args, options).catch((e) => {
      this.restoreServerGameState();
    });
  }

  public getStateName(): StateName {
    return this.gamedatas.gamestate.name;
  }

  public loopWizardStocks(
    callback: (stock: WizardSpaceStock, space_id: number, tier: number) => void
  ): void {
    const spaces = this.wtw.stocks.wizards.spaces;

    for (const i in spaces) {
      const space_id = Number(i);
      const space = spaces[space_id];
      for (const t in space) {
        const tier = Number(t);
        callback(space[tier], space_id, tier);
      }
    }
  }

  public bgaFormatText(log: string, args: any): { log: string; args: any } {
    try {
      if (log && args && !args.processed) {
        args.processed = true;

        for (const key in args) {
          if (!key.includes("_label")) {
            continue;
          }

          args[key] = `<span class="wtw_logHighlight">${args[key]}</span>`;
        }
      }
    } catch (e) {
      console.error(log, args, "Exception thrown", e.stack);
    }
    return { log, args };
  }

  initAutoHideWizards(): void {
    const tierElements = Array.from(
      document.querySelectorAll<HTMLElement>(".wtw_wizardTier")
    );

    const updateVisibility = (): void => {
      tierElements.forEach((tierElement) => {
        const space_id = Number(tierElement.parentElement.dataset.space);
        const tier = Number(tierElement.dataset.tier);
        const counter = this.wtw.counters.spaces[space_id];

        const isImprisoned = counter.getValue() > Number(tier);
        tierElement.classList.toggle("wtw_wizardTier-imprisoned", isImprisoned);
      });
    };

    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.getElementById("wtw_spacesContainer"), {
      childList: true,
      subtree: true,
    });

    updateVisibility();
  }
}
