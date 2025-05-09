interface WizardStocks {
  [space_id: number]: CardStock<BgaCard>;
}

interface WizardCard extends Card {
  stocks: WizardStocks;
  place(space_id: number): void;
  setup(): void;
}

class WizardCard extends Card {
  constructor(game: WanderingTowersGui, card: BgaCard) {
    super(game, card);
    this.stocks = this.game.wtw.stocks.wizards;
  }

  setup() {
    this.place(this.location_arg);
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_wizard");
    element.style.backgroundPosition = `${this.type * -100}%`;
  }

  place(space_id: number) {
    this.stocks[space_id].addCard(this.card, {}, { visible: true });
  }
}
