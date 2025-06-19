interface StPickMoveTier extends StateManager {
  action: ActionName;
}

class StPickMoveTier extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickMoveTier");
  }

  set() {
    const {
      action = "actMoveTower",
      moveCard,
      towerCard,
      maxTier,
      minTier,
    } = this.game.wtw.globals;

    if (maxTier === minTier) {
      const moveCard_id = action === "actMoveTower" ? moveCard.id : undefined;
      const tower = new Tower(this.game, towerCard);

      this.game.performAction(action, {
        moveCard_id: moveCard_id,
        space_id: tower.space_id,
        tier: maxTier - 1 || 1,
      });
      return;
    }

    this.game.setClientState("client_pickMoveTier", {
      descriptionmyturn: _("${you} must pick the number of tiers to move"),
    });
  }

  enter() {
    super.enter();

    const {
      moveCard,
      towerCard,
      maxTier,
      minTier,
      action = "actMoveTower",
    } = this.game.wtw.globals;

    const tower = new Tower(this.game, towerCard);
    tower.toggleSelection(true);

    const moveCard_id = action === "actMoveTower" ? moveCard.id : undefined;

    if (action === "actMoveTower") {
      const move = new Move(this.game, moveCard);
      move.toggleSelection(true);
    }

    for (let i = minTier; i <= maxTier; i++) {
      this.game.statusBar.addActionButton(
        `${i}`,
        () => {
          this.game.performAction(action, {
            moveCard_id: moveCard_id,
            space_id: tower.space_id,
            tier: maxTier - i + 1,
          });
        },
        {}
      );
    }
  }

  leave() {
    super.leave();

    const { moveCard, towerCard } = this.game.wtw.globals;

    if (moveCard) {
      const move = new Move(this.game, moveCard);
      move.toggleSelection(false);
    }

    const tower = new Tower(this.game, towerCard);
    tower.toggleSelection(false);
  }
}

interface arg_StPickMoveTier {
  client_args: { action: ActionName };
}
