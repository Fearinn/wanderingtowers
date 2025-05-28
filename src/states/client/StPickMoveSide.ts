class StPickMoveSide extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickMoveSide");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _(
        "${you} must pick whether to move a wizard or a tower"
      ),
    });
  }

  enter() {
    super.enter();

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

    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(true);
  }

  leave() {
    const card = this.game.wtw.globals.moveCard;
    const moveCard = new MoveCard(this.game, card);
    moveCard.toggleSelection(false);
  }
}
