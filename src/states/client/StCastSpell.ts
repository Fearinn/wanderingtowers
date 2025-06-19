class StCastSpell extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_castSpell");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a spell"),
    });
  }

  enter(args: args_StCastSpell) {
    super.enter();

    const spellTable = this.wtw.stocks.spells.table;
    spellTable.setSelectionMode("single");
    spellTable.setSelectableCards(args.castableSpells);

    spellTable.onSelectionChange = (selection, spellCard) => {
      this.game.removeConfirmationButton();

      if (selection.length > 0) {
        this.game.addConfirmationButton(_("spell"), () => {
          this.wtw.globals.spellCard = spellCard;

          if (spellCard.type === "wizard") {
            const stPickSpellWizard = new StPickSpellWizard(this.game);
            stPickSpellWizard.set();
            return;
          }

          if (spellCard.type === "tower") {
            const stPickSpellTower = new StPickSpellTower(this.game);
            stPickSpellTower.set();
            return;
          }

          this.game.performAction("actCastSpell", {
            spell_id: spellCard.type_arg,
          });
        });

        return;
      }
    };
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
