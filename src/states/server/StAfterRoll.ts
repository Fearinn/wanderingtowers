interface args_StAfterRoll {
  args: { moveCard: MoveCardBase };
}

class StAfterRoll extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "afterRoll");
  }

  enter(args: args_StAfterRoll) {
    super.enter();

    const moveCard = args.args.moveCard;
    this.game.wtw.globals.moveCard = moveCard;

    const move = new MoveCard(this.game, moveCard);
    move.toggleSelectedClass(true);

    if (move.card.type === "both") {
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

      return;
    }

    if (move.card.type === "tower") {
      const towerStocks = this.game.wtw.stocks.towers.spaces;
      for (const space_id in towerStocks) {
        const stock = towerStocks[space_id];
        stock.toggleSelection(true);
        stock.setSelectableCards(stock.getCards());
      }
      return;
    }

    if (move.card.type === "wizard") {
      const wizardStocks = this.game.wtw.stocks.wizards.spaces;
      for (const space_id in wizardStocks) {
        const stock = wizardStocks[space_id];
        stock.toggleSelection(true);

        const selectableCards = stock.getPlayerWizards(this.game.player_id);
        stock.setSelectableCards(selectableCards);
      }
      return;
    }
  }

  leave() {
    const moveCard = this.game.wtw.globals.moveCard;

    const move = new MoveCard(this.game, moveCard);
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
