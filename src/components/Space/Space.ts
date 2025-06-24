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
    this.tierCounter = wtw.counters.spaces[this.space_id];
  }

  updateTier(): void {
    const tier = this.towerStock.getCards().length;
    this.tierCounter.toValue(tier);
  }

  getMaxTier(): number {
    const towerCards = this.towerStock.getCards();
    const maxTier = towerCards.length;
    return maxTier;
  }

  getMinTier(): number {
    const towerCards = this.towerStock.getCards();

    const hasRavenskeep = towerCards.some((towerCard) => {
      const tower = new Tower(this.game, towerCard);
      return tower.isRavenskeep;
    });

    const minTier = hasRavenskeep ? 2 : 1;
    return minTier;
  }
}
