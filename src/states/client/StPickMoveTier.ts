class StPickMoveTier extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickMoveTier");
  }

  set() {
    this.game.setClientState("client_pickMoveTier", {
      descriptionmyturn: _("${you} must pick the number of tiers to move"),
    });
  }

  enter() {
    super.enter();

    const { moveCard, towerCard, maxTier } = this.game.wtw.globals;

    const tower = new Tower(this.game, towerCard);

    if (maxTier === 1) {
      this.game.performAction("actMoveTower", {
        moveCard_id: moveCard.id,
        space_id: tower.space_id,
        tier: maxTier,
      });
      return;
    }

    tower.toggleSelection(true);
    const move = new Move(this.game, moveCard);
    move.toggleSelection(true);

    for (let i = 1; i <= maxTier; i++) {
      this.game.statusBar.addActionButton(
        `${i}`,
        () => {
          this.game.performAction("actMoveTower", {
            moveCard_id: move.card.id,
            space_id: tower.space_id,
            tier: maxTier - i + 1,
          });
        },
        {}
      );
    }
  }

  leave() {
    const { moveCard, towerCard } = this.game.wtw.globals;

    const move = new Move(this.game, moveCard);
    move.toggleSelection(false);
    const tower = new Tower(this.game, towerCard);
    tower.toggleSelection(false);
  }
}
