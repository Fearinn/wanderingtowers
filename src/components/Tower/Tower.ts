interface TowerCardBase extends BgaCard {
  type_arg: number;
  tier: number;
}

interface TowerCard extends Card {
  stocks: TowerStocks;
  card: TowerCardBase;
  space_id: number;
  setup(): void;
  place(space_id: number): void;
  move(space_id: number, current_space_id: number): void;
}

class TowerCard extends Card {
  constructor(game: WanderingTowersGui, card: TowerCardBase) {
    super(game, card);
    this.card.tier = Number(card.tier);
    this.stocks = this.game.wtw.stocks.towers;
    this.space_id = this.card.location_arg;
  }

  setup() {
    this.place(this.location_arg);
  }

  setupDiv(element: HTMLDivElement) {
    element.classList.add("wtw_card", "wtw_tower");

    if (this.card.type_arg === 1) {
      element.classList.add("wtw_tower-ravenskeep");
    }

    if (this.card.type_arg % 2 === 0) {
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

  place(space_id: number) {
    this.space_id = space_id;
    const stock = this.stocks.spaces[space_id];
    stock.addCard(this.card, {}, { visible: true });
  }

  move(space_id: number, current_space_id: number) {
    this.place(space_id);

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

interface TowerSpaceStock extends CardStock<TowerCardBase> {
  game: WanderingTowersGui;
  space_id: number;
  setup(cards: TowerCardBase[]): void;
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
      this.game.removeConfirmationButton();

      if (selection.length > 0) {
        this.unselectOthers();

        const towerCard = new TowerCard(this.game, card);
        const space = new Space(this.game, towerCard.space_id);
        const maxTier = space.getMaxTier();

        this.game.wtw.globals.towerCard = towerCard.card;
          this.game.wtw.globals.maxTier = maxTier;

        if (maxTier > 1) {
          const stPickMoveTier = new StPickMoveTier(this.game);
          stPickMoveTier.set();
          return;
        }
        
        this.game.addConfirmationButton(_("tower"), () => {
          const stPickMoveTier = new StPickMoveTier(this.game);
          stPickMoveTier.set();
        });
        return;
      }

      this.game.restoreServerGameState();
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
