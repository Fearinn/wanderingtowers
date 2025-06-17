class StPickSpellWizard extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_castSpell");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a wizard"),
    });
  }

  enter(args: args_StCastSpell) {
    super.enter();
  }

  leave() {
    super.leave();

    const spellTable = this.wtw.stocks.spells.table;
    spellTable.setSelectionMode("none");
  }
}

interface args_StCastSpell {
  castableSpells: SpellCard[];
}
