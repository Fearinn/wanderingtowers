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
  }) {
    const { wizardCard, space_id } = args;
    const wizard = new Wizard(this.game, wizardCard);
    wizard.move(space_id);
  }

  public notif_moveTower(args: {
    cards: TowerCard[];
    final_space_id: number;
    current_space_id: number;
  }) {
    const { cards, final_space_id, current_space_id } = args;

    cards.forEach((card) => {
      const tower = new Tower(this.game, card);
      tower.move(final_space_id, current_space_id);
    });
  }

  public notif_discardMove(args: { card: MoveCard; player_id: number }): void {
    const { card, player_id } = args;

    const move = new Move(this.game, card);
    move.discard(player_id);
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
  }

  public notif_usePotions(args: { nbr: number; player_id: number }): void {
    const { nbr, player_id } = args;
    const cargo = this.stocks.potions[player_id].cargo;
    const voidStock = this.stocks.potions.void;
    const potionCards = cargo.getCards().slice(0, nbr);
    voidStock.addCards(potionCards);
  }

  public async notif_enterRavenskeep(args: {
    wizardCard: WizardCard;
    player_id: number;
  }): Promise<void> {
    const { wizardCard, player_id } = args;
    const wizard = new Wizard(this.game, wizardCard);
    wizard.enterRavenskeep();
    this.game.wait(1000);
    this.game.wtw.counters[player_id].ravenskeep.incValue(1);
  }

  public notif_autoreshuffle(args: {}): void {
    const { discard, deck } = this.stocks.moves;
    deck.addCards(discard.getCards());
    deck.shuffle({ animatedCardsMax: 5 });
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
    const { wizardCard, towerCard, space_id, tier } = args;

    const towerElement = document.getElementById(`wtw_tower-${towerCard.id}`);
    towerElement.classList.add("wtw_tower-elevated");

    const tierElement = document.getElementById(
      `wtw_wizardTier-${space_id}-${tier}`
    );
    tierElement.classList.add("wtw_wizardTier-elevated");

    const wizard = new Wizard(this.game, wizardCard);
    await wizard.free();
    await this.game.wait(1000);

    towerElement.classList.remove("wtw_tower-elevated");
    tierElement.classList.remove("wtw_wizardTier-elevated");
  }

  public async notif_failFreeWizard(args: {
    towerCard: TowerCard;
    space_id: number;
    tier: number;
  }): Promise<void> {
    const { towerCard, space_id, tier } = args;

    const towerElement = document.getElementById(`wtw_tower-${towerCard.id}`);
    towerElement.classList.add("wtw_tower-elevated");

    const tierElement = document.getElementById(
      `wtw_wizardTier-${space_id}-${tier}`
    );
    tierElement.classList.add("wtw_wizardTier-elevated");

    await this.game.wait(1000);

    towerElement.classList.remove("wtw_tower-elevated");
    tierElement.classList.remove("wtw_wizardTier-elevated");
  }

  public notif_discardSpells(args: { spellCards: SpellCard[] }) {
    const { spellCards } = args;

    spellCards.forEach((spellCard) => {
      const spell = new Spell(this.game, spellCard);
      spell.discard();
    });
  }
}
