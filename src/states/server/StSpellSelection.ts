class StSpellSelection extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "spellSelection");
  }

  enter() {
    super.enter();

    const spellTable = this.wtw.stocks.spells.table;
    spellTable.setSelectionMode("multiple");

    spellTable.onSelectionChange = (selection, spellCard) => {
      if (selection.length > 3) {
        this.game.showMessage(_("You can't pick more than 3 spells"), "error");
        const spellTable = this.wtw.stocks.spells.table;
        spellTable.unselectCard(spellCard, true);
        return;
      }

      this.game.removeConfirmationButton();

      if (selection.length === 3) {
        const spell_ids = selection.map((spellCard) => {
          const spell = new Spell(this.game, spellCard);
          return spell.id;
        });

        this.game.addConfirmationButton(_("spells"), () => {
          this.game.performAction("actSelectSpells", {
            spell_ids: spell_ids.join(","),
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
