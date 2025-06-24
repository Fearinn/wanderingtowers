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

    const spellTable = this.wtw.stocks.spells.table;
    spellTable.setSelectionMode("single");
    spellTable.setSelectableCards(args.castableSpells);

    spellTable.onSelectionChange = (selection, spellCard) => {
      document.getElementById("wtw_spellBtn")?.remove();

      if (selection.length > 0) {
        const spell = new Spell(this.game, spellCard);

        this.statusBar.addActionButton(
          this.game.format_string_recursive(_("cast ${spell_label}"), {
            spell_label: _(spell.name),
          }),
          () => {
            this.wtw.globals.spellCard = spellCard;

            switch (spellCard.type) {
              case "wizard":
                const stPickSpellWizard = new StPickSpellWizard(this.game);
                stPickSpellWizard.set();
                break;

              case "tower":
                const stPickSpellTower = new StPickSpellTower(this.game);
                stPickSpellTower.set();
                break;

              case "direction":
                const stPickSpellDirection = new StPickSpellDirection(
                  this.game
                );
                stPickSpellDirection.set();
            }
          },
          {
            id: "wtw_spellBtn",
          }
        );

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
