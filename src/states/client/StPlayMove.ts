class StPlayMove extends StateManager {
  constructor(game: WanderingTowersGui) {
    super(game, "client_playMove");
  }

  set() {
    this.game.setClientState(this.stateName, {
      descriptionmyturn: _("${you} must pick a movement card"),
    });
  }

  enter(args: args_StPlayMove) {
    super.enter();

    const { playableMoves } = args._private;

    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(true);
    moveHand.setSelectableCards(playableMoves);

    moveHand.onSelectionChange = (selection, card) => {
      this.game.removeConfirmationButton();

      if (selection.length > 0) {
        this.game.wtw.globals.moveCard = card;
        const move = new Move(this.game, card);

        if (move.card.type_arg >= 19) {
          this.statusBar.setTitle(_("${you} must pick a movement card"));
          this.game.statusBar.removeActionButtons();

          this.game.statusBar.addActionButton(
            _("cancel"),
            () => {
              this.game.restoreServerGameState();
            },
            { color: "alert" }
          );

          this.game.addConfirmationButton(_("move"), () => {
            this.game.performAction("actRollDice", {
              moveCard_id: move.card.id,
            });
          });
          return;
        }

        if (move.card.type === "both") {
          const stPickMoveSide = new StPickMoveSide(this.game);
          stPickMoveSide.set();
          return;
        }

        if (move.card.type === "tower") {
          const stPickMoveTower = new StPickMoveTower(this.game);
          stPickMoveTower.set();
          return;
        }

        if (move.card.type === "wizard") {
          const stPickMoveWizard = new StPickMoveWizard(this.game);
          stPickMoveWizard.set();
          return;
        }

        return;
      }

      this.game.restoreServerGameState();
    };
  }

  leave() {
    super.leave();

    const moveHand = this.wtw.stocks.moves.hand;
    moveHand.toggleSelection(false);
  }
}

interface args_StPlayMove {
  _private: {
    playableMoves: MoveCard[];
  };
}
