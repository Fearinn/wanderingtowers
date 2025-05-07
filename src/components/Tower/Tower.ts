interface TowerStocks {
  [space_id: number]: CardStock<CardBase>;
}

interface TowerCard extends Card {
  stocks: TowerStocks;
  place(space_id: number): void;
}

class TowerCard extends Card {
  constructor(game: WanderingTowersGui, card: CardBase) {
    super(game, card);
    this.stocks = this.game.wtw.stocks.towers;
  }

  place(space_id: number) {
    this.stocks[space_id].addCard(this.card, {}, { visible: true });
  }
}
