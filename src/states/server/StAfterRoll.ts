class StAfterRoll extends StateManager {
  constructor(game: WanderingTowersGui){
    super(game, "afterRoll");
  }

  enter(args: arg_StAfterRoll) {
    super.enter();

    this.game.wtw.globals = {};

    const { moveCard, _private } = args;
    const { movableMeeples } = _private;
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
      return;
    }

    if (move.card.type === "wizard") {
      const wizardStocks = this.game.wtw.stocks.wizards.spaces;
      for (const space_id in wizardStocks) {
        const stock = wizardStocks[space_id];
        stock.toggleSelection(true);
        stock.setSelectableCards(movableMeeples[move.card.id].wizard);

        stock.onSelectionChange = (selection, card) => {
          this.game.removeConfirmationButton();

          if (selection.length > 0) {
            stock.unselectOthers();

            this.game.addConfirmationButton(_("wizard"), () => {
              this.game.performAction("actMoveWizard", {
                moveCard_id: move.card.id,
                wizardCard_id: card.id,
              });
            });
          }
        };
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
  _private: {
    movableMeeples: MovableMeeples;
  };
  moveCard: MoveCard;
}
