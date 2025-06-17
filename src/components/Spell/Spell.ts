interface SpellCard extends BgaCard {
  type_arg: number;
  location: "table" | "deck";
}

interface Spell extends Card {
  card: SpellCard;
  table: SpellStocks["table"];
}

class Spell extends Card {
  constructor(game: WanderingTowersGui, card: SpellCard) {
    super(game, card);
    this.table = this.game.wtw.stocks.spells.table;
  }

  setup(): void {
    this.table.addCard(this.card);

    console.log(this.card);

    if (this.card.location !== "table") {
      this.table.setCardVisible(this.card, false);
    }
  }

  setupDiv(element: HTMLDivElement): void {
    element.classList.add("wtw_card", "wtw_spell");
  }

  setupFrontDiv(element: HTMLDivElement): void {
    element.parentElement.parentElement.style.backgroundPosition = `${
      this.card.type_arg * -100
    }%`;
  }
}

interface SpellStocks {
  table: CardStock<SpellCard>;
}
