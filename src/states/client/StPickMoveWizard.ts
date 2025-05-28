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