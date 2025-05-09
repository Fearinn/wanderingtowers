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
