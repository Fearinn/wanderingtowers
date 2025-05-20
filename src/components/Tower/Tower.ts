interface TowerCardBase extends BgaCard {
  type_arg: number;
  tier: number;
}

interface TowerStocks {
  spaces: {
    [space_id: number]: TowerSpaceStock;
  };
}

interface TowerSpaceStock extends CardStock<TowerCardBase> {
  game: WanderingTowersGui;
  space_id: number;
  setup(cards: TowerCardBase[]): void;
  unselectOthers(): void;
}

class TowerSpaceStock extends CardStock<TowerCardBase> {
  constructor(
    game: WanderingTowersGui,
    manager: CardManager<TowerCardBase>,
    space_id: number
  ) {
    super(manager, document.getElementById(`wtw_spaceTowers-${space_id}`), {
      sort: sortFunction("-tier"),
    });

    this.game = game;
    this.space_id = space_id;
    this.setSelectionMode("none");

    this.onSelectionChange = (selection, card) => {
      document.getElementById("wtw_confirmationButton")?.remove();

      if (selection.length > 0) {
        this.unselectOthers();
        this.game.addConfirmationButton(_("tower"), () => {
          this.game.performAction("actMoveTower", {
            moveCard_id: this.game.wtw.globals.moveCard.id,
            towerCard_id: card.id,
          });
        });
      }
    };
  }

  unselectOthers() {
    const otherStocks = this.game.wtw.stocks.towers.spaces;

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
}

interface TowerCard extends Card {
  stocks: TowerStocks;
  card: TowerCardBase;
  setup(): void;
  place(space_id: number): void;
  move(space_id: number): void;
}

class TowerCard extends Card {
  constructor(game: WanderingTowersGui, card: TowerCardBase) {
    super(game, card);
    this.card.tier = Number(card.tier);
    this.stocks = this.game.wtw.stocks.towers;
  }

  setup() {
    this.place(this.location_arg);
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_tower");

    if (this.type_arg === 1) {
      element.classList.add("wtw_tower-ravenskeep");
    }

    if (this.type_arg % 2 === 0) {
      element.classList.add("wtw_tower-raven");
    }
  }

  place(space_id: number) {
    const stock = this.stocks.spaces[space_id];
    stock.addCard(this.card, {}, { visible: true });
  }

  move(space_id: number) {
    this.place(space_id);
  }
}
