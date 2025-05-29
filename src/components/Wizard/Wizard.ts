interface WizardCardBase extends BgaCard {
  type_arg: number;
  tier: number;
}

interface WizardStocks {
  spaces: { [space_id: number]: WizardSpaceStock };
}

interface WizardCard extends Card {
  card: WizardCardBase;
  stocks: WizardStocks;
  space_id: number;
  towerTier: number;
  setup(): void;
  place(space_id: number): void;
  move(space_id: number): void;
}

class WizardCard extends Card {
  constructor(game: WanderingTowersGui, card: WizardCardBase) {
    super(game, card);
    this.space_id = this.card.location_arg;
    this.card.tier = Number(card.tier);
    this.stocks = this.game.wtw.stocks.wizards;
    this.towerTier =
      this.game.wtw.stocks.towers.spaces[this.space_id].getCards().length;
  }

  setup() {
    this.place(this.space_id);
    if (this.card.tier < this.towerTier) {
      this.toggleVisibility(false);
    }
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_wizard");
    element.style.backgroundPosition = `${Number(this.card.type) * -100}%`;

    const player_id = this.card.type_arg;
    const tooltip =
      player_id === this.game.player_id
        ? _("Your wizard")
        : _("${player_name}'s wizard");

    this.game.addTooltip(
      element.id,
      this.game.format_string_recursive(_(tooltip), {
        player_id,
        player_name: this.game.gamedatas.players[player_id].name,
      }),
      ""
    );
  }

  place(space_id: number): void {
    this.stocks.spaces[space_id].addCard(this.card, {}, { visible: true });
  }

  move(space_id: number): void {
    this.place(space_id);
  }

  toggleVisibility(isVisible: boolean) {
    const element = this.stocks.spaces[this.space_id].getCardElement(this.card);
    element.classList.toggle("wtw_wizard-imprisioned", !isVisible);
  }
}

interface WizardSpaceStock extends CardStock<WizardCardBase> {
  game: WanderingTowersGui;
  space_id: number;
  setup(cards: WizardCardBase[]): void;
  getPlayerWizards(player_id: number): WizardCardBase[];
  unselectOthers(): void;
}

class WizardSpaceStock extends CardStock<WizardCardBase> {
  constructor(
    game: WanderingTowersGui,
    manager: CardManager<WizardCardBase>,
    space_id: number
  ) {
    super(manager, document.getElementById(`wtw_spaceWizards-${space_id}`), {
      sort: sortFunction("type"),
    });

    this.game = game;
    this.space_id = space_id;
    this.setSelectionMode("none");

    this.onSelectionChange = (selection, card) => {
      this.game.removeConfirmationButton();
      
      if (selection.length > 0) {
        this.unselectOthers();
        this.game.addConfirmationButton(_("wizard"), () => {
          this.game.performAction("actMoveWizard", {
            moveCard_id: this.game.wtw.globals.moveCard.id,
            wizardCard_id: card.id,
          });
        });
      }
    };
  }

  unselectOthers() {
    const otherStocks = this.game.wtw.stocks.wizards.spaces;

    for (const space_id in otherStocks) {
      if (Number(space_id) === this.space_id) {
        continue;
      }
      otherStocks[space_id].unselectAll(true);
    }
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
