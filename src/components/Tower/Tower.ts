interface TowerStocks {
  [space_id: number]: CardStock<CardBase>;
}

interface TowerCard extends Card {
  stocks: TowerStocks;
  place(space_id: number): void;
  setup(): void;
}

class TowerCard extends Card {
  constructor(game: WanderingTowersGui, card: CardBase) {
    super(game, card);
    this.stocks = this.game.wtw.stocks.towers;
  }

  setup() {
    this.place(this.type_arg);
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_tower");

    if (this.type_arg === 1) {
      element.classList.add("wtw_tower-ravenskeep");
    }

    if (this.type_arg % 2 === 0) {
      element.classList.add("wtw_tower-raven");
    }
  }

  place(space_id: number) {
    this.stocks[space_id].addCard(this.card, {}, { visible: true });
  }
}
