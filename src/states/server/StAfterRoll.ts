class StAfterRoll extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "afterRoll");
  }

  enter(args: arg_StAfterRoll) {
    super.enter();

    this.game.wtw.globals = {};

    const { moveCard, movableMeeples } = args;
    this.game.wtw.globals.moveCard = moveCard;

    const move = new Move(this.game, moveCard);
    move.toggleSelectedClass(true);

    if (move.card.type === "both") {
      this.statusBar.addActionButton(
        _("tower"),
        () => {
          const stPickMoveTower = new StPickMoveTower(this.game);
          stPickMoveTower.set();
        },
        {}
      );

      this.statusBar.addActionButton(
        _("wizard"),
        () => {
          const stPickMoveWizard = new StPickMoveWizard(this.game);
          stPickMoveWizard.set();
        },
        {}
      );

      return;
    }

    if (move.card.type === "tower") {
      const towerStocks = this.game.wtw.stocks.towers.spaces;
      for (const space_id in towerStocks) {
        const stock = towerStocks[space_id];
        stock.toggleSelection(true);
        stock.setSelectableCards(movableMeeples[move.card.id].tower);
      }
      return;
    }

    if (move.card.type === "wizard") {
      const wizardStocks = this.game.wtw.stocks.wizards.spaces;
      for (const space_id in wizardStocks) {
        const stock = wizardStocks[space_id];
        stock.toggleSelection(true);

        stock.setSelectableCards(movableMeeples[move.card.id].wizard);
      }
      return;
    }
  }

  leave() {
    super.leave();

    const moveCard = this.game.wtw.globals.moveCard;

    const move = new Move(this.game, moveCard);
    move.toggleSelectedClass(false);

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(false);
    }

    const wizardStocks = this.game.wtw.stocks.wizards.spaces;
    for (const space_id in wizardStocks) {
      const stock = wizardStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface arg_StAfterRoll {
  moveCard: MoveCard;
  movableMeeples: MovableMeeples;
}
