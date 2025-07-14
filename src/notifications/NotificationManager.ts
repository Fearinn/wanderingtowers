interface NotificationManager {
  game: WanderingTowersGui;
  stocks: Stocks;
}

class NotificationManager implements NotificationManager {
  constructor(game: WanderingTowersGui) {
    this.game = game;
    this.stocks = this.game.wtw.stocks;
  }

  public notif_moveWizard(args: {
    wizardCard: WizardCard;
    space_id: number;
    tier: number;
    withTower?: boolean;
    current_space_id?: number;
    current_tier?: number;
  }) {
    const { wizardCard, space_id } = args;
    const wizard = new Wizard(this.game, wizardCard);

    wizard.move(space_id);

    if (args.withTower) {
      const { current_space_id, current_tier } = args;

      const space = new Space(this.game, current_space_id);

      if (space.tierCounter.getValue() > current_tier) {
        const wizardCardElement =
          this.game.wtw.managers.wizards.getCardElement(wizardCard);

        wizardCardElement.parentElement.dataset.covered = "1";
      }
    }
  }

  public async notif_moveTower(args: {
    cards: TowerCard[];
    final_space_id: number;
    current_space_id: number;
  }): Promise<void> {
    const { cards, final_space_id, current_space_id } = args;

    const promises: Promise<void>[] = [];
    cards.forEach((towerCard) => {
      const tower = new Tower(this.game, towerCard);
      promises.push(tower.move(final_space_id, current_space_id));

      const towerCardElement =
        this.game.wtw.managers.towers.getCardElement(towerCard);
      towerCardElement.dataset.animated = "1";
    });

    await Promise.all(promises);

    cards.forEach((towerCard) => {
      const towerCardElement =
        this.game.wtw.managers.towers.getCardElement(towerCard);
      towerCardElement.dataset.animated = "0";
    });

    document
      .querySelectorAll(`[data-covered="${1}"]`)
      .forEach((tierElement: HTMLElement) => {
        tierElement.dataset.covered = "0";
      });
  }

  public notif_discardMove(args: {
    moveCard: MoveCard;
    player_id: number;
  }): void {
    const { moveCard, player_id } = args;

    const move = new Move(this.game, moveCard);
    move.discard(player_id);
    this.game.wtw.counters.discard.incValue(1);
  }

  public notif_drawMove(args: { cards: MoveCard[]; player_id: number }): void {
    const { cards, player_id } = args;

    if (this.game.player_id == player_id) {
      return;
    }

    cards.forEach((card) => {
      const move = new Move(this.game, card);
      move.draw(false);
    });
  }

  public notif_drawMovePriv(args: { cards: MoveCard[] }): void {
    const { cards } = args;

    cards.forEach((card) => {
      const move = new Move(this.game, card);
      move.draw(true);
    });
  }

  public notif_rollDie(args: { face: number }): void {
    const { face } = args;

    this.stocks.dice.rollDie({ id: 1, type: "die", face });
  }

  public notif_fillPotion(args: { potionCard: PotionCard }): void {
    const { potionCard } = args;
    const potion = new Potion(this.game, potionCard);
    potion.fill();

    this.game.soundPlay("pour");
  }

  public notif_usePotions(args: { nbr: number; player_id: number }): void {
    const { nbr, player_id } = args;
    const cargo = this.stocks.potions[player_id].cargo;
    const voidStock = this.stocks.potions.void;
    const potionCards = cargo.getCards().slice(0, nbr);
    voidStock.addCards(potionCards);

    this.game.soundPlay("drink");
  }

  public async notif_enterRavenskeep(args: {
    wizardCard: WizardCard;
    player_id: number;
  }): Promise<void> {
    const { wizardCard, player_id } = args;
    const wizard = new Wizard(this.game, wizardCard);
    await wizard.enterRavenskeep();
    this.game.wtw.counters[player_id].ravenskeep.incValue(1);
  }

  public async notif_autoreshuffle(args: { deckCount: number }): Promise<void> {
    const { deckCount } = args;
    const { discard, deck } = this.stocks.moves;

    const discardCards = discard.getCards();
    discard.removeCards(discardCards);
    await deck.setCardNumber(deckCount);
    deck.shuffle({ animatedCardsMax: 5 });

    this.game.wtw.counters.discard.toValue(0);
  }

  public notif_incScore(args: { score: number; player_id: number }): void {
    const { score, player_id } = args;
    this.game.scoreCtrl[player_id].incValue(score);
  }

  public notif_swapTower(args: {
    towerCard: TowerCard;
    final_space_id: number;
    current_space_id: number;
  }): void {
    const { towerCard, final_space_id, current_space_id } = args;

    const tower = new Tower(this.game, towerCard);
    tower.move(final_space_id, current_space_id);
  }

  public async notif_freeWizard(args: {
    wizardCard: WizardCard;
    towerCard: TowerCard;
    space_id: number;
    tier: number;
  }): Promise<void> {
    const { wizardCard, towerCard } = args;

    const towerElement = document.getElementById(`wtw_tower-${towerCard.id}`);
    towerElement.classList.add("wtw_tower-elevated");
    towerElement.dataset.elevated = "1";

    const wizard = new Wizard(this.game, wizardCard);
    await this.game.wait(500);
    await wizard.free();
    await this.game.wait(1000);
    towerElement.dataset.elevated = "0";
    await this.game.wait(1500);

    towerElement.removeAttribute("data-elevated");
    towerElement.classList.remove("wtw_tower-elevated");
  }

  public async notif_failFreeWizard(args: {
    towerCard: TowerCard;
    space_id: number;
    tier: number;
  }): Promise<void> {
    const { towerCard } = args;

    const towerElement = document.getElementById(`wtw_tower-${towerCard.id}`);
    towerElement.classList.add("wtw_tower-elevated");
    towerElement.setAttribute("data-elevated", "1");

    await this.game.wait(3000);

    towerElement.removeAttribute("data-elevated");
    towerElement.classList.remove("wtw_tower-elevated");
  }

  public notif_discardSpells(args: { spellCards: SpellCard[] }) {
    const { spellCards } = args;

    spellCards.forEach((spellCard) => {
      const spell = new Spell(this.game, spellCard);
      spell.discard();
    });
  }

  public notif_incTurnsPlayed(args: { player_id: number }) {
    const { player_id } = args;
    this.game.wtw.counters[player_id].turn.incValue(1);
  }
}
