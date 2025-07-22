class StPickSwapTower extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickSwapTower");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick 2 towers to swap"),
    });
  }

  enter(args: arg_stPickSwapTower) {
    super.enter();

    const { spellCard } = this.game.wtw.globals;

    const spell = new Spell(this.game, spellCard);
    const selectableTowers = args.spellableMeeples[spell.id].tower;

    spell.toggleSelection(true);
    const towerStocks = this.game.wtw.stocks.towers.spaces;

    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(true);
      stock.setSelectableCards(selectableTowers);

      stock.onSelectionChange = (selection, towerCard) => {
        let { spaces = [] } = this.game.wtw.globals;

        this.game.removeConfirmationButton();

        const tower = new Tower(this.game, towerCard);
        const space_id = tower.space_id;

        if (selection.length > 0) {
          spaces = [...spaces, space_id];

          if (spaces.length > 2) {
            this.game.showMessage(_("You must pick exactly 2 towers"), "error");
            stock.unselectCard(towerCard, true);

            this.game.addConfirmationButton(_("towers"), () => {
              this.game.performAction("actCastSpell", {
                spell_id: spell.id,
                target_id: spaces[0],
                target2_id: spaces[1],
              });
            });
            return;
          }

          this.game.wtw.globals.spaces = spaces;

          if (spaces.length === 2) {
            this.game.addConfirmationButton(_("towers"), () => {
              this.game.performAction("actCastSpell", {
                spell_id: spell.id,
                target_id: spaces[0],
                target2_id: spaces[1],
              });
            });
          }
        } else {
          spaces = spaces.filter((s_id) => {
            return space_id !== s_id;
          });
          this.game.wtw.globals.spaces = spaces;
        }
      };
    }
  }

  leave() {
    super.leave();

    const spellTable = this.game.wtw.stocks.spells.table;
    spellTable.setSelectionMode("none");

    const towerStocks = this.game.wtw.stocks.towers.spaces;
    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(false);
    }
  }
}

interface arg_stPickSwapTower {
  spellableMeeples: SpellableMeeples;
}
