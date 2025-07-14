interface TowerCard extends BgaCard {
  type: "raven" | "ravenskeep" | "normal";
  type_arg: number;
  tier: number;
}

interface Tower extends Card {
  stocks: TowerStocks;
  card: TowerCard;
  space_id: number;
  isRavenskeep: boolean;
}

class Tower extends Card {
  constructor(game: WanderingTowersGui, card: TowerCard) {
    super(game, card);
    this.card.tier = Number(card.tier);
    this.stocks = this.game.wtw.stocks.towers;
    this.space_id = this.card.location_arg;
    this.isRavenskeep = this.card.type === "ravenskeep";
  }

  setup() {
    this.place(this.location_arg);
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_tower");

    if (this.isRavenskeep) {
      element.classList.add("wtw_tower-ravenskeep");
    }

    if (this.card.type === "raven") {
      element.classList.add("wtw_tower-raven");
    }
  }

  toggleSelection(enabled: boolean): void {
    this.stocks.spaces[this.space_id].toggleSelection(enabled);

    if (enabled) {
      this.select(true);
    }
  }

  select(silent = false): void {
    this.stocks.spaces[this.space_id].selectCard(this.card, silent);
  }

  async place(space_id: number) {
    this.space_id = space_id;
    const stock = this.stocks.spaces[space_id];
    await stock.addCard(this.card, {}, { visible: true });
  }

  async move(space_id: number, current_space_id: number) {
    await this.place(space_id);
    
    const prevSpace = new Space(this.game, current_space_id);
    prevSpace.updateTier();

    const nextSpace = new Space(this.game, space_id);
    nextSpace.updateTier();
  }
}

interface TowerStocks {
  spaces: {
    [space_id: number]: TowerSpaceStock;
  };
}

interface TowerSpaceStock extends CardStock<TowerCard> {
  game: WanderingTowersGui;
  space_id: number;
  setup(cards: TowerCard[]): void;
}

class TowerSpaceStock extends CardStock<TowerCard> {
  constructor(
    game: WanderingTowersGui,
    manager: CardManager<TowerCard>,
    space_id: number
  ) {
    super(manager, document.getElementById(`wtw_spaceTowers-${space_id}`), {
      sort: sortFunction("-tier"),
    });

    this.game = game;
    this.space_id = space_id;
    this.setSelectionMode("none");
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
