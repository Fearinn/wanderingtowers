interface Space {
  game: WanderingTowersGui;
  space_id: number;
  towerStock: TowerSpaceStock;
  wizardStock: WizardSpaceStock;
  tierCounter: Counter;
}

class Space {
  constructor(game: WanderingTowersGui, space_id: number) {
    this.game = game;
    this.space_id = space_id;

    const { wtw } = this.game;
    this.towerStock = wtw.stocks.towers.spaces[this.space_id];
    this.wizardStock = wtw.stocks.wizards.spaces[this.space_id];
    this.tierCounter = wtw.counters.spaces[this.space_id];
  }

  updateTier() {
    const tier = this.towerStock.getCards().length;
    this.tierCounter.toValue(tier);
  }
}
