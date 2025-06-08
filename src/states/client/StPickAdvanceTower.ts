class StPickAdvanceTower extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickAdvanceTower");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a tower to advance 1 space"),
    });
  }

  enter(args: arg_StPickAdvanceTower) {
    super.enter();

    const { advanceableTowers } = args;

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(advanceableTowers);
    }
  }

  leave() {
    const towerStocks = this.game.wtw.stocks.towers.spaces;

    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface arg_StPickAdvanceTower {
  advanceableTowers: TowerCard[];
}
