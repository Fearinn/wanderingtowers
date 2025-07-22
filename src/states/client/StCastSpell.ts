class StCastSpell extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_castSpell");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a spell"),
    });
  }

  enter(args: args_StCastSpell) {
    super.enter();

    const spellTable = this.game.wtw.stocks.spells.table;
    spellTable.setSelectionMode("single");
    spellTable.setSelectableCards(args.castableSpells);

    spellTable.onSelectionChange = (selection, spellCard) => {
      document.getElementById("wtw_spellBtn")?.remove();

      if (selection.length > 0) {
        const spell = new Spell(this.game, spellCard);

        this.game.wtw.globals.spellCard = spellCard;

        switch (spell.card.type) {
          case "wizard":
            const stPickSpellWizard = new StPickSpellWizard(this.game);
            stPickSpellWizard.set();
            break;

          case "tower":
            if (spell.id === 6) {
              const stPickSwapTower = new StPickSwapTower(this.game);
              stPickSwapTower.set();
              break;
            }
            const stPickSpellTower = new StPickSpellTower(this.game);
            stPickSpellTower.set();
            break;

          case "direction":
            const stPickSpellDirection = new StPickSpellDirection(this.game);
            stPickSpellDirection.set();
        }

        return;
      }
    };
  }

  leave() {
    super.leave();

    const spellTable = this.game.wtw.stocks.spells.table;
    spellTable.setSelectionMode("none");
  }
}

interface args_StCastSpell {
  castableSpells: SpellCard[];
}
