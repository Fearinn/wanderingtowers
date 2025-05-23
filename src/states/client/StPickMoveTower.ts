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
