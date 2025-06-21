interface SpellCard extends BgaCard {
  type: "wizard" | "tower" | "auto";
  type_arg: number;
  location: "table" | "deck";
  id: number;
}

interface SpellInfo {
  name: string;
  description: string;
  details?: string;
}

interface Spell extends Card {
  card: SpellCard;
  table: SpellStocks["table"];
  name: string;
  description: string;
}

class Spell extends Card {
  constructor(game: WanderingTowersGui, card: SpellCard) {
    super(game, card);
    this.table = this.game.wtw.stocks.spells.table;
    this.id = this.card.type_arg;

    const info = this.game.wtw.material.spells[this.id];
    this.description = info.description;
    this.name = info.name;
  }

  setup(): void {
    this.table.addCard(this.card);

    if (this.card.location !== "table") {
      this.table.setCardVisible(this.card, false);
    }
  }

  setupDiv(element: HTMLDivElement): void {
    element.classList.add("wtw_card", "wtw_spell");
  }

  setupFrontDiv(element: HTMLDivElement): void {
    element.style.backgroundPosition = `${this.card.type_arg * -100}%`;

    const cloneElement = element.parentElement.parentElement.cloneNode(
      true
    ) as HTMLDivElement;

    cloneElement.removeAttribute("id");
    cloneElement.querySelectorAll("[id]").forEach((childElement) => {
      childElement.removeAttribute("id");
    });
    cloneElement.classList.add("wtw_spell-tooltip");

    const tooltipHTML = `
      <div class="wtw_spellTooltip">
        ${cloneElement.outerHTML}
        <div class="wtw_tooltipText wtw_spellDescription">
          <h4 class="wtw_tooltipTitle">${this.name}</h4>
          <p>${this.description}</p>
        </div>
      </div>
    `;

    this.game.addTooltipHtml(element.id, tooltipHTML);
  }

  toggleSelection(enabled: boolean): void {
    this.table.setSelectionMode(enabled ? "single" : "none");

    if (enabled) {
      this.select(true);
      this.table.onSelectionChange = () => {
        this.game.restoreServerGameState();
      };
    }
  }

  select(silent = false): void {
    this.table.selectCard(this.card, silent);
  }
}

interface SpellStocks {
  table: CardStock<SpellCard>;
}
