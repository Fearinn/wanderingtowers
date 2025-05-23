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

    if (maxTier === 1) {
      this.game.performAction("actMoveTower", {
        moveCard_id: moveCard.id,
        towerCard_id: towerCard.id,
        tier: maxTier,
      });
      return;
    }

    const move = new MoveCard(this.game, moveCard);
    move.toggleSelection(true);

    const tower = new TowerCard(this.game, towerCard);
    tower.toggleSelection(true);

    for (let i = 1; i <= maxTier; i++) {
      this.game.statusBar.addActionButton(
        `${i}`,
        () => {
          this.game.performAction("actMoveTower", {
            moveCard_id: moveCard.id,
            towerCard_id: tower.card.id,
            tier: maxTier - i,
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
