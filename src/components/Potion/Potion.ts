interface PotionCard extends BgaCard {
  type_arg: number;
}

interface Potion extends Card {
  cargo: PotionCargoStock;
  player_id: number | null;
  card: PotionCard;
}

class Potion extends Card {
  constructor(game: WanderingTowersGui, card: PotionCard) {
    super(game, card);
    this.player_id = this.card.location_arg;
    this.cargo = this.game.wtw.stocks.potions[this.player_id].cargo;
  }

  setup() {
    this.cargo.addCard(this.card, {});
    this.cargo.setCardVisible(this.card, this.card.location === "empty");
  }

  setupDiv(element: HTMLDivElement): void {
    element.classList.add("wtw_card", "wtw_potion");
  }

  setupFrontDiv(element: HTMLDivElement): void {
    if (!this.card.type_arg) {
      return;
    }

    element.classList.add("wtw_potion-empty");
    element.style.backgroundPosition = `${Number(this.card.type) * -100}%`;
  }

  setupBackDiv(element: HTMLDivElement): void {
    element.classList.add("wtw_potion-filled");
    element.style.backgroundPosition = `${Number(this.card.type) * -100}%`;
  }

  fill() {
    this.cargo.setCardVisible(this.card, false);
  }
}

interface PotionStocks {
  [player_id: number]: { cargo: PotionCargoStock };
}

interface PotionCargoStock extends LineStock<PotionCard> {
  game: WanderingTowersGui;
}

class PotionCargoStock extends LineStock<PotionCard> {
  constructor(
    game: WanderingTowersGui,
    manager: CardManager<PotionCard>,
    player_id: number
  ) {
    super(manager, document.getElementById(`wtw_potionCargo-${player_id}`));

    this.game = game;
    this.setSelectionMode("none");
  }

  setup(cards: PotionCard[]) {
    cards.forEach((card) => {
      const potion = new Potion(this.game, card);
      potion.setup();
    });
  }
}
