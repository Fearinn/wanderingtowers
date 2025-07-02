class StPickSpellTower extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickSpellTower");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a tower for the spell"),
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

          const tower = new Tower(this.game, towerCard);
          const space = new Space(this.game, tower.space_id);

          const maxTier = space.getMaxTier();

          const minTier = space.getMinTier(spell.id !== 7);

          this.game.wtw.globals.towerCard = tower.card;
          this.game.wtw.globals.maxTier = maxTier;
          this.game.wtw.globals.minTier = minTier;

          if (maxTier > minTier && spell.id !== 6) {
            const stPickSpellTier = new StPickSpellTier(this.game);
            stPickSpellTier.set();
            return;
          }

          this.game.addConfirmationButton(_("tower"), () => {
            if (spell.id === 6) {
              this.game.performAction("actCastSpell", {
                spell_id: spell.id,
                meeple_id: tower.space_id,
              });
              return;
            }

            const stPickSpellTier = new StPickSpellTier(this.game);
            stPickSpellTier.set();
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
