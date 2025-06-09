class StPlayerTurn extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "playerTurn");
  }

  enter(args: arg_playerTurn) {
    super.enter();

    const { advanceableTowers } = args;

    this.statusBar.addActionButton(
      _("play movement"),
      () => {
        const stPlayMove = new StPlayMove(this.game);
        stPlayMove.set();
      },
      {}
    );

    if (advanceableTowers.length > 0) {
      this.statusBar.addActionButton(
        _("advance a tower (discards hand)"),
        () => {
          const stPickAdvanceTower = new StPickAdvanceTower(this.game);
          stPickAdvanceTower.set();
        },
        {}
      );
    }
  }
}

interface arg_playerTurn {
  playableMoves: MoveCard[];
  movableMeeples: MovableMeeples;
  advanceableTowers: TowerCard[];
}
