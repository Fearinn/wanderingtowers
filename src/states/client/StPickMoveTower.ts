class StPickMoveTower extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickMoveTower");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a tower to move"),
    });
  }

  enter(args: arg_StPickMoveTower) {
    super.enter();

    const { movableMeeples } = args;

    const card = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, card);
    move.toggleSelection(true);

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(movableMeeples[move.card.id].towers);
    }
  }

  leave() {
    const card = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, card);
    move.toggleSelection(false);

    const towerStocks = this.game.wtw.stocks.towers.spaces;

    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface arg_StPickMoveTower {
  movableMeeples: MovableMeeples;
}
