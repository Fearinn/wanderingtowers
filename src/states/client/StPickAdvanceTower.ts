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

      stock.onSelectionChange = (selection, card) => {
        this.game.removeConfirmationButton();

        if (selection.length > 0) {
          stock.unselectOthers();

          const tower = new Tower(this.game, card);
          const space = new Space(this.game, tower.space_id);
          const maxTier = space.getMaxTier();

          this.game.wtw.globals.towerCard = tower.card;
          this.game.wtw.globals.maxTier = maxTier;
          this.game.wtw.globals.action = "actAdvanceTower";

          if (maxTier > 1) {
            const stPickMoveTier = new StPickMoveTier(this.game);
            stPickMoveTier.set();
            return;
          }

          this.game.addConfirmationButton(_("tower"), () => {
            const stPickMoveTier = new StPickMoveTier(this.game);
            stPickMoveTier.set();
          });
          return;
        }

        this.game.restoreServerGameState();
      };
    }
  }

  leave() {
    super.leave();
    
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
