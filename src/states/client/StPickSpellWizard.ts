class StPickSpellWizard extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickSpellWizard");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a wizard"),
    });
  }

  enter(args: args_StPickSpellWizards) {
    super.enter();

    const { spellCard } = this.wtw.globals;

    const spell = new Spell(this.game, spellCard);
    spell.toggleSelection(true);

    const selectableWizards = args.spellableMeeples[spell.id].wizard;

    const wizardStocks = this.game.wtw.stocks.wizards.spaces;
    for (const space_id in wizardStocks) {
      const stock = wizardStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(selectableWizards);
      stock.onSelectionChange = (selection, wizardCard) => {
        this.game.removeConfirmationButton();

        if (selection.length > 0) {
          stock.unselectOthers();

          this.game.addConfirmationButton(_("wizard"), () => {
            this.game.performAction("actCastSpell", {
              spell_id: spell.id,
              meeple_id: wizardCard.id,
            });
          });
        }
      };
    }
  }

  leave() {
    super.leave();

    const spellTable = this.wtw.stocks.spells.table;
    spellTable.setSelectionMode("none");

    const wizardStocks = this.game.wtw.stocks.wizards.spaces;
    for (const space_id in wizardStocks) {
      const stock = wizardStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface args_StPickSpellWizards {
  spellableMeeples: SpellableMeeples;
}
