interface SpellCard extends BgaCard {
  type_arg: number;
  location: "table" | "deck";
  id: number;
}

interface Spell extends Card {
  card: SpellCard;
  table: SpellStocks["table"];
}

class Spell extends Card {
  constructor(game: WanderingTowersGui, card: SpellCard) {
    super(game, card);
    this.table = this.game.wtw.stocks.spells.table;
    this.id = this.card.type_arg;
  }

  setup(): void {
    this.table.addCard(this.card);

    if (this.card.location !== "table") {
      this.table.setCardVisible(this.card, false);
    }
  }

  setupDiv(element: HTMLDivElement): void {
    element.classList.add("wtw_card", "wtw_spell");
    element.style.position = `${this.card.type_arg}%`;
  }

  setupFrontDiv(element: HTMLDivElement): void {
    element.parentElement.parentElement.style.backgroundPosition = `${
      this.card.type_arg * -100
    }%`;
  }

  toggleSelection(enabled: boolean): void {
    this.table.setSelectionMode(enabled ? "single" : "none");

    if (enabled) {
      this.select(true);
    }
  }

  select(silent = false): void {
    this.table.selectCard(this.card, silent);
  }
}

interface SpellStocks {
  table: CardStock<SpellCard>;
}
