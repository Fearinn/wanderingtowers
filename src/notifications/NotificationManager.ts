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
    card: WizardCard;
    space_id: number;
    tier: number;
  }) {
    const { card, space_id } = args;
    const wizard = new Wizard(this.game, card);
    wizard.move(space_id);
  }

  public notif_toggleWizardVisibility(args: {
    card: WizardCard;
    isVisible: boolean;
  }) {
    const { card, isVisible } = args;
    const wizard = new Wizard(this.game, card);
    wizard.toggleVisibility(isVisible);
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

  public notif_wizardToRavenskeep(args: {
    wizardCard: WizardCard;
    player_id: number;
  }): void {
    const { wizardCard, player_id } = args;
    const wizard = new Wizard(this.game, wizardCard);
    wizard.moveToRavenskeep();
    this.game.wtw.counters[player_id].ravenskeep.incValue(1);
  }
}
