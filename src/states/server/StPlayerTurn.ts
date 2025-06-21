class StPlayerTurn extends StateManager {
  constructor(game: WanderingTowers) {
    super(game, "playerTurn");
  }

  enter(args: arg_playerTurn) {
    super.enter();

    this.wtw.globals = {};

    const { _private, pushableTowers, castableSpells, canPass } = args;
    const { playableMoves } = _private;

    if (playableMoves.length > 0) {
      this.statusBar.addActionButton(
        _("play movement"),
        () => {
          const stPlayMove = new StPlayMove(this.game);
          stPlayMove.set();
        },
        {}
      );
    }

    if (castableSpells.length > 0) {
      this.statusBar.addActionButton(
        _("cast spell"),
        () => {
          const stCastSpell = new StCastSpell(this.game);
          stCastSpell.set();
        },
        {}
      );
    }

    if (pushableTowers.length > 0) {
      this.statusBar.addActionButton(
        _("push a tower (discards hand)"),
        () => {
          const stPickPushTower = new StPickPushTower(this.game);
          stPickPushTower.set();
        },
        { classes: ["wtw_button", "wtw_button-brown"] }
      );
    }

    if (canPass) {
      this.statusBar.addActionButton(
        _("pass"),
        () => {
          this.game.performAction("actPass");
        },
        {
          color: "alert",
        }
      );
    }
  }

  leave() {
    super.leave();
  }
}

interface arg_playerTurn {
  _private: {
    playableMoves: MoveCard[];
  };
  pushableTowers: TowerCard[];
  castableSpells: SpellCard[];
  canPass: boolean;
}
