interface MoveStocks {
  deck: CardStock<CardBase>;
  discard: CardStock<CardBase>;
  hand: CardStock<CardBase>;
}

interface MoveCard extends Card {
  stocks: MoveStocks;
  player_id: number | null;
  location: "deck" | "discard" | "hand";
  type_arg?: number;
  setup(): void;
}

class MoveCard extends Card {
  constructor(game: WanderingTowersGui, card: CardBase) {
    super(game, card);
    this.stocks = this.game.wtw.stocks.moves;
    this.player_id = this.location === "hand" ? this.location_arg : null;
  }

  setup() {
    if (this.location === "hand") {
      if (this.player_id) {
        this.stocks.hand.addCard(this.card, {}, { visible: true });
      }
      return;
    }

    this.stocks.deck.addCard(this.card, {}, { visible: false });
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_move");
  }

  setupFrontDiv(element: HTMLDivElement) {
    if (!this.type_arg) {
      return;
    }

    element.style.backgroundPosition = `${(this.type_arg - 1) * -100}%`;
    element.classList.add("wtw_move-front");
  }

  setupBackDiv(element: HTMLDivElement) {
    element.classList.add("wtw_move-back");
  }
}
