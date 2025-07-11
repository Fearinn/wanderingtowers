interface WizardCard extends BgaCard {
  type_arg: number;
  tier: number;
}

interface WizardStocks {
  spaces: { [space_id: number]: { [tier: number]: WizardSpaceStock } };
}

interface Wizard extends Card {
  card: WizardCard;
  stocks: WizardStocks;
  space_id: number;
  towerTier: number;
  tier: number;
}

class Wizard extends Card {
  constructor(game: WanderingTowersGui, card: WizardCard) {
    super(game, card);
    this.space_id = this.card.location_arg;
    this.card.tier = Number(card.tier);
    this.stocks = this.game.wtw.stocks.wizards;
    this.towerTier =
      this.game.wtw.stocks.towers.spaces[this.space_id].getCards().length;
    this.tier = this.card.tier;
  }

  setup() {
    this.place(this.space_id);
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_wizard");

    const backgroundPosition = `${Number(this.card.type) * -100}%`;
    element.style.backgroundPosition = backgroundPosition;

    const player_id = this.card.type_arg;

    const { color } = this.game.gamedatas.players[player_id];
    element.style.setProperty("--color", `#${color}aa`);

    if (Number(this.card.type) === 5) {
      // element.style.filter = "grayscale(20%)";
    };

    const tooltip =
      player_id === this.game.player_id
        ? _("Your wizard")
        : _("${player_name}'s wizard");

    const tooltipText = this.game.format_string_recursive(_(tooltip), {
      player_id,
      player_name: this.game.gamedatas.players[player_id].name,
    });

    this.game.addTooltipHtml(
      element.id,
      `
      <div class="wtw_wizardTooltip">
        <div class="wtw_card wtw_wizard wtw_wizard-tooltip" style="background-position: ${backgroundPosition}"></div>
        <span class="wtw_tooltipText">${tooltipText}</span>
      </div>
      `
    );

    const panelWizard = document.getElementById(`wtw_panelWizard-${player_id}`);
    if (!panelWizard.style.backgroundPosition) {
      panelWizard.style.backgroundPosition = backgroundPosition;
    }
  }

  place(space_id: number): void {
    this.stocks.spaces[space_id][this.tier].addCard(
      this.card,
      {},
      { visible: true }
    );
  }

  move(space_id: number): void {
    this.place(space_id);
  }

  async enterRavenskeep(): Promise<void> {
    const stock = this.stocks.spaces[this.space_id][this.tier];
    const cardElement = stock.getCardElement(this.card);
    cardElement.classList.add("wtw_wizard-ravenskeep");
    await this.game.wait(1000);
    cardElement.remove();
    stock.cardRemoved(this.card);
  }

  async free(): Promise<boolean> {
    return this.stocks.spaces[this.space_id][this.tier].addCard(this.card);
  }
}

interface WizardSpaceStock extends CardStock<WizardCard> {
  game: WanderingTowersGui;
  space_id: number;
}

class WizardSpaceStock extends CardStock<WizardCard> {
  constructor(
    game: WanderingTowersGui,
    manager: CardManager<WizardCard>,
    space_id: number,
    tier: number
  ) {
    super(
      manager,
      document.getElementById(`wtw_wizardTier-${space_id}-${tier}`),
      {}
    );

    this.game = game;
    this.space_id = space_id;
    this.setSelectionMode("none");
  }

  unselectOthers() {
    this.game.loopWizardStocks((stock, space_id, tier) => {
      if (Number(space_id) === this.space_id) {
        return;
      }
      stock.unselectAll(true);
    });
  }

  toggleSelection(enable: boolean) {
    const selectionMode = enable ? "single" : "none";
    this.setSelectionMode(selectionMode);
  }

  getPlayerWizards(player_id: number) {
    return this.getCards().filter((card) => {
      return card.type_arg === player_id;
    });
  }
}
