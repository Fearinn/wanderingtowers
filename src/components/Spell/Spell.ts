interface SpellCard extends BgaCard {
  type: "wizard" | "tower" | "direction";
  type_arg: number;
  location: "table" | "deck";
  id: number;
}

interface SpellInfo {
  tr_name: string;
  description: string;
  cost: number;
}

interface Spell extends Card {
  card: SpellCard;
  table: SpellStocks["table"];
  name: string;
  description: string;
  cost: number;
}

class Spell extends Card {
  constructor(game: WanderingTowersGui, card: SpellCard) {
    super(game, card);
    this.table = this.game.wtw.stocks.spells.table;
    this.id = this.card.type_arg;

    const info = this.game.gamedatas.SPELLS[this.id];
    this.description = info.description;
    this.name = info.tr_name;
    this.cost = info.cost;
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

    if (this.card.type_arg === 7) {
      element.style.backgroundPosition = "-800%";
    }

    const tooltipHTML = this.createTooltip(element.parentElement.parentElement);
    this.game.addTooltipHtml(element.id, tooltipHTML);
  }

  createTooltip(element?: HTMLElement): string {
    if (!element) {
      element = document.getElementById(`wtw_spell-${this.id}`);
    }
    const cloneElement = element.cloneNode(true) as HTMLDivElement;

    cloneElement.removeAttribute("id");
    cloneElement.querySelectorAll("[id]").forEach((childElement) => {
      childElement.removeAttribute("id");
    });
    cloneElement.classList.add("wtw_spell-tooltip");

    const tooltipHTML = `<div class="wtw_spellTooltip">
      <h4 class="wtw_tooltipText wtw_tooltipTitle">${this.name}</h4>
      <div class="wtw_spellContent">
          ${cloneElement.outerHTML}
          <div class="bga-autofit wtw_spellDescription wtw_tooltipText">
            <p>${this.description}</p>
            <p>${this.game.format_string_recursive(
              "Cost: ${cost} full bottle(s)",
              {
                cost: this.cost,
              }
            )}</p>
          </div>
        </div>
      </div>`;

    return tooltipHTML;
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

  discard(): void {
    this.table.setCardVisible(this.card, false);
  }
}

interface SpellStocks {
  table: CardStock<SpellCard>;
}
