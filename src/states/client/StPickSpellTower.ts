class StPickSpellTower extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "client_pickSpellTower");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a tower"),
    });
  }

  enter(args: args_StPickSpellTower) {
    super.enter();

    const { spellCard } = this.wtw.globals;

    const spell = new Spell(this.game, spellCard);
    spell.toggleSelection(true);

    const selectableTowers = args.spellableMeeples[spell.id].tower;

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(selectableTowers);
      stock.onSelectionChange = (selection, towerCard) => {
        this.game.removeConfirmationButton();

        if (selection.length > 0) {
          stock.unselectOthers();

          this.game.addConfirmationButton(_("tower"), () => {
            this.game.performAction("actCastSpell", {
              spell_id: spell.id,
              meeple_id: towerCard.id,
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

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface args_StPickSpellTower {
  spellableMeeples: SpellableMeeples;
}
