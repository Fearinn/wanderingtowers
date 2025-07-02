class StPickMoveSide extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickMoveSide");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _(
        "${you} must pick whether to move a wizard or a tower"
      ),
    });
  }

  enter(args: arg_StPickMoveSide) {
    super.enter();

    const moveCard = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, moveCard);
    move.toggleSelection(true);

    const { movableMeeples } = args._private;
    const { tower: movableTowers, wizard: movableWizards } =
      movableMeeples[moveCard.id];

    this.statusBar.addActionButton(
      _("tower"),
      () => {
        const stPickMoveTower = new StPickMoveTower(this.game);
        stPickMoveTower.set();
      },
      { disabled: movableTowers.length === 0 }
    );

    this.statusBar.addActionButton(
      _("wizard"),
      () => {
        const stPickMoveWizard = new StPickMoveWizard(this.game);
        stPickMoveWizard.set();
      },
      {
        disabled: movableWizards.length === 0,
      }
    );
  }

  leave() {
    super.leave();

    const moveCard = this.game.wtw.globals.moveCard;
    const move = new Move(this.game, moveCard);
    move.toggleSelection(false);
  }
}

interface arg_StPickMoveSide {
  _private: {
    movableMeeples: MovableMeeples;
  };
}
