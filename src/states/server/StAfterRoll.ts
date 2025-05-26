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
    move.toggleSelection(true);

    if (move.card.type === "tower") {
      new StPickMoveTower(this.game).enter();
    }

    if (move.card.type === "wizard") {
      new StPickMoveWizard(this.game).enter();
    }
  }
}
