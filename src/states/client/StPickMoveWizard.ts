class StPickMoveWizard extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickMoveWizard");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a wizard to move"),
    });
  }

  enter(args: arg_StPickMoveWizard) {
    super.enter();

    const { movableMeeples } = args._private;

    const moveCard = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, moveCard);
    move.toggleSelection(true);

    const wizardStocks = this.game.wtw.stocks.wizards.spaces;
    for (const space_id in wizardStocks) {
      const stock = wizardStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(movableMeeples[move.card.id].wizard);

      stock.onSelectionChange = (selection, towerCard) => {
        this.game.removeConfirmationButton();

        if (selection.length > 0) {
          stock.unselectOthers();

          this.game.addConfirmationButton(_("wizard"), () => {
            this.game.performAction("actMoveWizard", {
              moveCard_id: move.card.id,
              wizardCard_id: towerCard.id,
            });
          });
        }
      };
    }
  }

  leave() {
    super.leave();

    const card = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, card);
    move.toggleSelection(false);

    const wizardStocks = this.game.wtw.stocks.wizards.spaces;
    for (const space_id in wizardStocks) {
      const stock = wizardStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface arg_StPickMoveWizard {
  _private: {
    movableMeeples: MovableMeeples;
  };
}
