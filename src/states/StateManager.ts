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
      { classes: ["wtw_positiveButton"] }
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
      _("tower"),
      () => {
        this.game.setClientState("client_pickMoveTower", {
          descriptionmyturn: _("${you} must pick a tower to move"),
        });
      },
      {}
    );

    this.statusBar.addActionButton(
      _("wizard"),
      () => {
        this.game.setClientState("client_pickMoveWizard", {
          descriptionmyturn: _("${you} must pick a wizard to move"),
        });
      },
      {}
    );

    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(true);
  }

  leave() {
    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(false);
  }
}

class StPickMoveWizard extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickMoveWizard");
  }

  enter() {
    super.enter();

    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(true);

    const wizardStocks = this.game.wtw.stocks.wizards.spaces;
    for (const space_id in wizardStocks) {
      const stock = wizardStocks[space_id];
      stock.toggleSelection(true);

      const selectableCards = stock.getPlayerWizards(this.game.player_id);
      stock.setSelectableCards(selectableCards);
    }
  }

  leave() {
    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(false);

    const wizardStocks = this.game.wtw.stocks.wizards.spaces;

    for (const space_id in wizardStocks) {
      const stock = wizardStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

class StPickMoveTower extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickMoveTower");
  }

  enter() {
    super.enter();

    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(true);

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(stock.getCards());
    }
  }

  leave() {
    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(false);

    const towerStocks = this.game.wtw.stocks.towers.spaces;

    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}
