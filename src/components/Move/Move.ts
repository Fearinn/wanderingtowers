interface MoveStocks {
  deck: CardStock<BgaCard>;
  discard: CardStock<BgaCard>;
  hand: MoveHandStock;
}

interface MoveHandStock extends HandStock<BgaCard> {
  game: WanderingTowersGui;
  setup(cards: BgaCard[]): void;
}

interface MoveCard extends Card {
  stocks: MoveStocks;
  player_id: number | null;
  location: "deck" | "discard" | "hand";
  type_arg?: number;
  setup(): void;
}

class MoveHandStock extends HandStock<BgaCard> {
  constructor(game: WanderingTowersGui, manager: CardManager<BgaCard>) {
    super(manager, document.getElementById("wtw_hand"), {
      cardOverlap: "0",
    });

    this.game = game;
    this.onSelectionChange = (selection, lastChange) => {};
  }

  setup(cards: BgaCard[]) {
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
  constructor(game: WanderingTowersGui, card: BgaCard) {
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
