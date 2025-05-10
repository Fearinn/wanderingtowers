interface MoveCardBase extends BgaCard {
  location: "deck" | "discard" | "hand";
  type: "both" | "wizard" | "tower";
  type_arg?: number;
}

interface MoveStocks {
  deck: CardStock<MoveCardBase>;
  discard: CardStock<MoveCardBase>;
  hand: MoveHandStock;
}

interface MoveHandStock extends HandStock<MoveCardBase> {
  game: WanderingTowersGui;
  setup(cards: MoveCardBase[]): void;
}

interface MoveCard extends Card {
  stocks: MoveStocks;
  player_id: number | null;
  card: MoveCardBase;
  setup(): void;
}

class MoveHandStock extends HandStock<MoveCardBase> {
  constructor(game: WanderingTowersGui, manager: CardManager<MoveCardBase>) {
    super(manager, document.getElementById("wtw_hand"), {
      cardOverlap: "0",
    });

    this.game = game;
    this.setSelectionMode("none");

    this.onSelectionChange = (selection, lastChange) => {
      const card = lastChange;
      if (selection.length > 0) {
        if (card.type === "both") {
          this.game.setClientState("client_pickMoveSide", {
            descriptionmyturn: _(
              "${you} must pick whether to move a wizard or a tower"
            ),
            client_args: { card },
          });
          return;
        }

        if (card.type === "tower") {
          this.game.setClientState("client_pickWizard", {
            descriptionmyturn: _(
              "${you} must pick a tower to move"
            ),
            client_args: { card },
          });
        }

        if (card.type === "wizard") {
          this.game.setClientState("client_pickWizard", {
            descriptionmyturn: _(
              "${you} must pick a wizard to move"
            ),
            client_args: { card },
          });
        }

        return;
      }

      this.game.restoreServerGameState();
    };
  }

  setup(cards: MoveCardBase[]) {
    cards.forEach((card) => {
      const moveCard = new MoveCard(this.game, card);
      moveCard.setup();
    });
  }

  toggleSelection(enable: boolean) {
    const selectionMode = enable ? "single" : "none";
    this.setSelectionMode(selectionMode);
  }
}

class MoveCard extends Card {
  constructor(game: WanderingTowersGui, card: MoveCardBase) {
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

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_move");
  }

  setupFrontDiv(element: HTMLDivElement) {
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

  setupBackDiv(element: HTMLDivElement) {
    element.classList.add("wtw_move-back");
  }
}
