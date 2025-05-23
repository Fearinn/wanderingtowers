class StPickMoveSide extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickMoveSide");
  }

  enter() {
    super.enter();

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
