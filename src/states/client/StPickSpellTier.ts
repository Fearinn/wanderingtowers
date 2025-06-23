interface StPickSpellTier extends StateManager {
  action: ActionName;
}

class StPickSpellTier extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickSpellTier");
  }

  set() {
    const { spellCard, towerCard, maxTier, minTier } = this.game.wtw.globals;

    if (maxTier === minTier) {
      const tower = new Tower(this.game, towerCard);
      const spell = new Spell(this.game, spellCard);

      this.game.performAction("actCastSpell", {
        spell_id: spell.id,
        meeple_id: tower.space_id,
        tier: maxTier - 1 || 1,
      });
      return;
    }

    this.game.setClientState("client_pickSpellTier", {
      descriptionmyturn: _(
        "${you} must pick the number of tiers for the spell"
      ),
    });
  }

  enter() {
    super.enter();

    const { spellCard, towerCard, maxTier, minTier } = this.game.wtw.globals;

    const spell = new Spell(this.game, spellCard);
    spell.toggleSelection(true);

    const tower = new Tower(this.game, towerCard);
    tower.toggleSelection(true);

    for (let i = minTier; i <= maxTier; i++) {
      this.game.statusBar.addActionButton(
        `${i}`,
        () => {
          this.game.performAction("actCastSpell", {
            spell_id: spell.id,
            meeple_id: tower.space_id,
            tier: maxTier - i + 1,
          });
        },
        {}
      );
    }
  }

  leave() {
    super.leave();

    const { spellCard, towerCard } = this.game.wtw.globals;

    const spell = new Spell(this.game, spellCard);
    spell.toggleSelection(false);

    const tower = new Tower(this.game, towerCard);
    tower.toggleSelection(false);
  }
}

interface arg_StPickSpellTier {
  client_args: { action: ActionName };
}
