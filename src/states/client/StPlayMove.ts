class StPlayMove extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_playMove");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a movement card"),
    });
  }

  enter(args: args_StPlayMove) {
    super.enter();

    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(true);
    console.log(args.playableMoves);
    moveHand.setSelectableCards(args.playableMoves);
  }

  leave() {
    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(false);
  }
}

interface args_StPlayMove {
  playableMoves: MoveCard[];
}
