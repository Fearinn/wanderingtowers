interface StPickMoveTier extends StateManager {
  action: ActionName;
}

class StPickMoveTier extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickMoveTier");
  }

  set(action: ActionName = "actMoveTower") {
    this.game.setClientState("client_pickMoveTier", {
      descriptionmyturn: _("${you} must pick the number of tiers to move"),
    });
    this.game.wtw.globals.action = action;
  }

  enter() {
    super.enter();

    const { moveCard, towerCard, maxTier, action = "actMoveTower" } = this.game.wtw.globals;
    const tower = new Tower(this.game, towerCard);

    if (maxTier === 1) {
      this.game.performAction(action, {
        moveCard_id: action === "actMoveTower" ? moveCard.id : undefined,
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
          this.game.performAction(action, {
            moveCard_id: action === "actMoveTower" ? move.card.id : undefined,
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
