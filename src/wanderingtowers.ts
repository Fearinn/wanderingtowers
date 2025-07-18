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
      unselectableCardClass: "wtw_tower-unselectable",
      selectableCardClass: "wtw_tower-selectable",
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
      unselectableCardClass: "wtw_wizard-unselectable",
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
        return `wtw_spell-${card.type_arg}`;
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
      discard: new ebg.counter(),
    };
    counters.discard.create("wtw_discardCounter");
    counters.discard.setValue(gamedatas.moveDiscardCount);

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
          `<div id="wtw_wizardTier-${space_id}-${tier}" class="wtw_wizardTier" 
          data-space=${space_id} data-tier=${tier}></div>`
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
      const player = gamedatas.players[p_id];
      const player_id = Number(p_id);
      const playerPanelElement = this.getPlayerPanelElement(player_id);

      playerPanelElement.insertAdjacentHTML(
        "beforeend",
        `<div id="wtw_turnCounter-${player_id}" class="wtw_whiteblock wtw_turnCounter">
          <i class="fa6 fa6-user-clock"></i>
          <span id="wtw_turnCount-${player_id}" class="wtw_turnCount">0</span>
        </div>
        <div id="wtw_ravenskeepCounter-${player_id}" class="wtw_whiteblock wtw_ravenskeepCounter">
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
        `wtw_turnCounter-${player_id}`,
        `<span class="wtw_tooltipText">
          ${_("number of turns played")}
        </span>`
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
        turn: new ebg.counter(),
      };

      const { ravenskeep, turn } = counters[player_id];
      ravenskeep.create(`wtw_ravenskeepCount-${player_id}`);
      ravenskeep.setValue(gamedatas.ravenskeepCounts[player_id]);

      turn.create(`wtw_turnCount-${player_id}`);
      turn.setValue(player.turns_played);

      const { finalTurn } = gamedatas;
      if (finalTurn > 0 && finalTurn === player.turns_played) {
        this.disablePlayerPanel(player_id);
        document
          .getElementById(`overall_player_board_${player_id}`)
          .classList.add("wtw_playerPanel-disabled");
      }

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
    };

    this.wtw.stocks.moves.deck.setCardNumber(gamedatas.moveDeckCount);

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

    gamedatas.moveDiscard.forEach((card) => {
      const move = new Move(this, card);
      move.discard();
    });

    moveStocks.hand.setup(gamedatas.hand);

    gamedatas.spellCards.forEach((spellCard) => {
      const spell = new Spell(this, spellCard);
      spell.setup();
    });

    if (gamedatas.finalTurn) {
      this.finalTurnBanner();
    }

    this.setupNotifications();
    BgaAutoFit.init();
    this.initObserver();
    this.buildHelp(gamedatas.spellCards);
    this.loadSounds();
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
        new StPickMoveSide(this).enter(args.args);
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

      case "client_pickSpellDirection":
        new StPickSpellDirection(this).enter();
        break;

      case "spellSelection":
        new StSpellSelection(this).enter();
        break;
    }
  }

  public onLeavingState(stateName: StateName): void {
    if (!this.isCurrentPlayerActive()) {
      return;
    }

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

      case "client_pickSpellDirection":
        new StPickSpellDirection(this).leave();
        break;

      case "spellSelection":
        new StSpellSelection(this).leave();
        break;
    }
  }
  public onUpdateActionButtons(stateName: string, args: object): void {}

  public setupNotifications(): void {
    const notificationManager = new NotificationManager(this);
    this.bgaSetupPromiseNotifications({
      handlers: [notificationManager],
      minDuration: 1000,
      minDurationNoText: 1,
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
    args: any = {},
    options = { lock: true, checkAction: true }
  ): void {
    args.GAME_VERSION = this.gamedatas.GAME_VERSION;

    this.bgaPerformAction(action, args, options).catch((e) => {
      this.restoreServerGameState();
    });
  }

  public getStateName(): StateName {
    return this.gamedatas.gamestate.name as StateName;
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

        if (args.move_icon !== undefined && args.moveCard) {
          const { moveCard } = args;
          const move = new Move(this, moveCard);
          const moveIcon = move.generateIcon();
          args.move_icon = moveIcon;
        }

        for (const key in args) {
          if (!key.includes("_label")) {
            continue;
          }

          const arg = args.i18n?.includes(key) ? _(args[key]) : args[key];

          args[key] = `<span class="wtw_logHighlight">${arg}</span>`;
        }
      }
    } catch (e) {
      console.error(log, args, "Exception thrown", e.stack);
    }
    return { log, args };
  }

  initObserver(): void {
    const updateVisibility = (): void => {
      const towerClass = "wtw_tower-elevated";

      document
        .querySelectorAll(".wtw_spaceTowers")
        .forEach((spaceElement: HTMLElement) => {
          const space_id = Number(spaceElement.dataset.space);

          const towerElements = Array.from(spaceElement.children).filter(
            (child) => {
              return !child.classList.contains("wtw_tierCounter");
            }
          );

          const elevatedTier =
            towerElements.findIndex((sibling: HTMLElement) => {
              return sibling.dataset.elevated;
            }) + 1;

          towerElements.forEach((towerElement: HTMLElement, index: number) => {
            const tier = index + 1;

            if (!elevatedTier) {
              towerElement.classList.remove(towerClass);
            }

            if (towerElement.classList.contains(towerClass)) {
              return;
            }

            const mustElevate = elevatedTier > 0 && elevatedTier < tier;
            towerElement.classList.toggle(towerClass, mustElevate);
          });

          const tierClass = "wtw_wizardTier-elevated";

          const tierElements = document.querySelectorAll(
            `[data-tier][data-space="${space_id}"]:not(:empty)`
          );

          tierElements.forEach((tierElement: HTMLElement) => {
            const tier = Number(tierElement.dataset.tier);

            const towerAbove = towerElements[tier] as HTMLElement;
            const towerBelow = towerElements[tier - 1] as HTMLElement;

            const revealedByElevation =
              !towerBelow?.classList.contains(towerClass) &&
              towerAbove?.classList.contains(towerClass) &&
              towerAbove?.dataset.elevated === "1";

            const revealedByMove =
              towerAbove?.dataset.animated === "1" &&
              towerBelow?.dataset.animated !== "1";

            let mustReveal =
              (revealedByMove ||
                revealedByElevation ||
                towerElements.length <= tier) &&
              tierElement.dataset.covered !== "1";

            tierElement.classList.toggle("wtw_wizardTier-visible", mustReveal);
            tierElement.classList.toggle(
              "wtw_wizardTier-underMove",
              revealedByMove
            );

            if (elevatedTier === 0) {
              tierElements.forEach((tierElement) => {
                tierElement.classList.remove(tierClass);
              });
              return;
            }

            const mustElevate = tier >= elevatedTier;
            tierElement.classList.toggle(tierClass, mustElevate);
          });
        });
    };

    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.getElementById("wtw_spacesContainer"), {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-elevated", "data-animated", "data-covered"],
    });

    updateVisibility();
  }

  public buildHelp(spellCards: SpellCard[]): void {
    const cards = spellCards
      .filter((spellCard) => {
        return spellCard.location === "table";
      })
      .sort((a, b) => {
        const spell_a = new Spell(this, a);
        const spell_b = new Spell(this, b);
        return spell_a.id - spell_b.id;
      });

    const spellHelp = document.createElement("div");
    spellHelp.classList.add("wtw_spellHelp");
    cards.forEach((spellCard) => {
      const spell = new Spell(this, spellCard);
      const spellTooltip = spell.createTooltip();
      spellHelp.insertAdjacentHTML("beforeend", spellTooltip);
    });

    const unfoldedHelp = `<div id="wtw_unfoldedHelp" class="wtw_unfoldedHelp"> 
      ${spellHelp.outerHTML}
    </div>`;

    this.wtw.managers.help = new HelpManager(this, {
      buttons: [
        new BgaHelpExpandableButton({
          // @ts-ignore
          title: _("spell reference"),
          foldedHtml: `<span class="wtw_foldedHelp">?</span>`,
          unfoldedHtml: unfoldedHelp,
        }),
      ],
    });
  }

  public finalTurnBanner(): void {
    const pageTitle = document.getElementById("page-title");
    pageTitle.insertAdjacentHTML(
      "beforeend",
      `<span class="wtw_finalTurn">${_("This is the last round!")}<span>`
    );
  }

  public soundPlay(sound_id: "pour" | "drink"): void {
    if (this.getGameUserPreference(102) == 1) {
      this.disableNextMoveSound();
      this.sounds.play(sound_id);
    }
  }

  private loadSounds(): void {
    const sounds_ids = ["pour", "drink"];
    sounds_ids.forEach((sound_id) => {
      this.sounds.load(sound_id);
    });
  }

  onGameUserPreferenceChanged(
    pref_id: 100 | 101 | 102,
    pref_value: number
  ): void {
    switch (pref_id) {
      case 101:
        const moveHandElement = document.getElementById("wtw_moveHand");

        if (pref_value == 3) {
          document
            .getElementById("wtw_gameArea")
            .insertAdjacentElement("afterbegin", moveHandElement);
          break;
        }

        document
          .getElementById("bga-zoom-wrapper")
          .insertAdjacentElement("beforebegin", moveHandElement);
        break;
    }
  }
}
