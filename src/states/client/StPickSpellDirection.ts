class StPickSpellDirection extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickSpellDirection");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick the direction of the spell"),
    });
  }

  enter() {
    super.enter();

    const { spellCard } = this.game.wtw.globals;
    const spell = new Spell(this.game, spellCard);
    spell.toggleSelection(true);

    this.statusBar.addActionButton(
      _("clockwise"),
      () => {
        this.game.performAction("actCastSpell", {
          spell_id: spell.id,
          direction: "clockwise",
        });
      },
      {}
    );

    this.statusBar.addActionButton(
      _("counterclockwise"),
      () => {
        this.game.performAction("actCastSpell", {
          spell_id: spell.id,
          direction: "counterclockwise",
        });
      },
      {}
    );
  }

  leave() {
    super.leave();

    const { spellCard } = this.game.wtw.globals;
    const spell = new Spell(this.game, spellCard);
    spell.toggleSelection(false);
  }
}
