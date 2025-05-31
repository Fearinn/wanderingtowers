interface MoveCard extends BgaCard {
  location: "deck" | "discard" | "hand";
  type: "both" | "wizard" | "tower";
  type_arg?: number;
}

interface MoveStocks {
  deck: CardStock<MoveCard>;
  discard: CardStock<MoveCard>;
  hand: MoveHandStock;
}

interface MoveHandStock extends HandStock<MoveCard> {
  game: WanderingTowersGui;
}

interface Move extends Card {
  stocks: MoveStocks;
  player_id: number | null;
  card: MoveCard;
}

class MoveHandStock extends HandStock<MoveCard> {
  constructor(game: WanderingTowersGui, manager: CardManager<MoveCard>) {
    super(manager, document.getElementById("wtw_moveHand"), {
      cardOverlap: "0",
    });

    this.game = game;
    this.setSelectionMode("none");

    this.onSelectionChange = (selection, card) => {
      this.game.removeConfirmationButton();

      if (selection.length > 0) {
        this.game.wtw.globals.moveCard = card;
        const move = new Move(this.game, card);

        if (move.card.type_arg >= 19) {
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

  setup(cards: MoveCard[]) {
    cards.forEach((card) => {
      const move = new Move(this.game, card);
      move.setup();
    });
  }

  toggleSelection(enable: boolean) {
    const selectionMode = enable ? "single" : "none";
    this.setSelectionMode(selectionMode);
  }
}

class Move extends Card {
  constructor(game: WanderingTowersGui, card: MoveCard) {
    super(game, card);
    this.stocks = this.game.wtw.stocks.moves;
    this.player_id = this.location === "hand" ? this.location_arg : null;
  }

  setup() {
    if (this.location === "hand") {
      this.stocks.hand.addCard(this.card, {}, { visible: true });
      this.stocks.hand.setCardVisible(this.card, true);
      return;
    }

    this.stocks.deck.addCard(this.card, {}, { visible: false });
    this.stocks.deck.setCardVisible(this.card, false);
  }

  setupDiv(element: HTMLDivElement): void {
    element.classList.add("wtw_card", "wtw_move");
  }

  setupFrontDiv(element: HTMLDivElement): void {
    if (!this.type_arg) {
      return;
    }

    element.classList.add("wtw_move-front");

    let spritePos = this.type_arg - 1;

    if (spritePos >= 10) {
      element.style.backgroundImage = `url("${g_gamethemeurl}img/moves_2.png")`;
      spritePos -= 10;
    }

    element.style.backgroundPosition = `${spritePos * -100}%`;
  }

  setupBackDiv(element: HTMLDivElement): void {
    element.classList.add("wtw_move-back");
  }

  toggleSelection(enabled: boolean): void {
    this.stocks.hand.toggleSelection(enabled);

    if (enabled) {
      this.select(true);
    }
  }

  select(silent = false): void {
    this.stocks.hand.selectCard(this.card, silent);
  }

  toggleSelectedClass(force?: boolean): void {
    this.stocks.hand
      .getCardElement(this.card)
      .classList.toggle("wtw_move-selected", force);
  }

  discard(): void {
    this.stocks.discard.addCard(this.card, {}, { visible: true });
  }

  draw(): void {
    this.stocks.hand.addCard(
      this.card,
      { fromStock: this.stocks.deck },
      { visible: true }
    );
  }
}
