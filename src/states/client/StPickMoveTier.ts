interface args_StPickMoveTier {
  client_args: {
    maxTier: number;
  };
}

class StPickMoveTier extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickMoveTier");
  }

  enter(args: args_StPickMoveTier) {
    super.enter();

    const { moveCard, towerCard } = this.game.wtw.globals;
    const { maxTier } = args.client_args;

    const tower = new TowerCard(this.game, towerCard);

    if (maxTier === 1) {
      this.game.performAction("actMoveTower", {
        moveCard_id: moveCard.id,
        space_id: tower.space_id,
        tier: maxTier,
      });
      return;
    }

    tower.toggleSelection(true);
    const move = new MoveCard(this.game, moveCard);
    move.toggleSelection(true);

    for (let i = 1; i <= maxTier; i++) {
      this.game.statusBar.addActionButton(
        `${i}`,
        () => {
          this.game.performAction("actMoveTower", {
            moveCard_id: moveCard.id,
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

    const move = new MoveCard(this.game, moveCard);
    move.toggleSelection(false);
    const tower = new TowerCard(this.game, towerCard);
    tower.toggleSelection(false);
  }
}
