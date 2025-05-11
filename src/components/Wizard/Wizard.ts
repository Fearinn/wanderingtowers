interface WizardCardBase extends BgaCard {
  type_arg: number;
}

interface WizardStocks {
  spaces: { [space_id: number]: WizardSpaceStock };
}

interface WizardCard extends Card {
  card: WizardCardBase;
  stocks: WizardStocks;
  place(space_id: number): void;
  setup(): void;
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

    this.onSelectionChange = (selection, lastChange) => {
      document.getElementById("wtw_confirmationButton")?.remove();

      if (selection.length > 0) {
        this.unselectOthers();
        this.game.addConfirmationButton(_("wizard"), () => {
          this.game.performAction("actMoveWizard", {
            moveCard_id: this.game.wtw.globals.moveCard.id,
            wizardCard_id: lastChange.id,
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

class WizardCard extends Card {
  constructor(game: WanderingTowersGui, card: WizardCardBase) {
    super(game, card);
    this.stocks = this.game.wtw.stocks.wizards;
  }

  setup() {
    this.place(this.card.location_arg);
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_wizard");
    element.style.backgroundPosition = `${Number(this.card.type) * -100}%`;
  }

  place(space_id: number) {
    this.stocks.spaces[space_id].addCard(this.card, {}, { visible: true });
  }
}
