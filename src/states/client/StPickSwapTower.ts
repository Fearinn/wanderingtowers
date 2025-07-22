class StPickSwapTower extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_pickSwapTower");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick 2 towers to swap"),
    });
  }

  enter() {
    super.enter();

    const { spellCard } = this.game.wtw.globals;

    const spell = new Spell(this.game, spellCard);

    spell.toggleSelection(true);
    const towerStocks = this.game.wtw.stocks.towers.spaces;

    for (const space_id in towerStocks) {
      const stock = towerStocks[space_id];
      stock.toggleSelection(true);

      stock.onSelectionChange = (selection, towerCard) => {
        const { spaces = [] } = this.game.wtw.globals;
        console.log(spaces, "TEST");

        this.game.removeConfirmationButton();

        const tower = new Tower(this.game, towerCard);
        const space_id = tower.space_id;

        if (selection.length > 0) {
          spaces.push(space_id);
          this.game.wtw.globals.spaces = spaces;
        }

        if (spaces.length > 2) {
          stock.unselectOthers();
          this.game.wtw.globals.spaces = [space_id];
          return;
        }

        if (spaces.length === 2) {
          this.game.addConfirmationButton(_("towers"), () => {
            this.game.performAction("actCastSpell", {
              spell_id: spell.id,
              target_id: spaces[0],
              target2_id: spaces[1],
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
