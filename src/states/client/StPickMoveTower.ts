class StPickMoveTower extends StateManager {
  constructor(game: WanderingTowersGui){
    super(game, "client_pickMoveTower");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a tower to move"),
    });
  }

  enter(args: arg_StPickMoveTower) {
    super.enter();

    const { movableMeeples } = args._private;

    const card = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, card);
    move.toggleSelection(true);

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(movableMeeples[move.card.id].tower);

      stock.onSelectionChange = (selection, card) => {
        this.game.removeConfirmationButton();

        if (selection.length > 0) {
          stock.unselectOthers();

          const tower = new Tower(this.game, card);
          const space = new Space(this.game, tower.space_id);
          const maxTier = space.getMaxTier();
          const minTier = space.getMinTier();

          this.game.wtw.globals.towerCard = tower.card;
          this.game.wtw.globals.maxTier = maxTier;
          this.game.wtw.globals.minTier = minTier;

          if (maxTier > minTier) {
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

    const moveCard = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, moveCard);
    move.toggleSelection(false);

    const towerStocks = this.game.wtw.stocks.towers.spaces;

    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface arg_StPickMoveTower {
  _private: {
    movableMeeples: MovableMeeples;
  };
}
