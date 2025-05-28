class StPlayMove extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_playMove");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a movement card"),
    });
  }

  enter() {
    super.enter();

    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(true);
  }

  leave() {
    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(false);
  }
}
