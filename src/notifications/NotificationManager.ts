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
    card: WizardCardBase;
    space_id: number;
    tier: number;
  }) {
    const { card, space_id } = args;
    const wizardCard = new WizardCard(this.game, card);
    wizardCard.move(space_id);
  }

  public notif_toggleWizardVisibility(args: {
    card: WizardCardBase;
    isVisible: boolean;
  }) {
    const { card, isVisible } = args;
    const wizardCard = new WizardCard(this.game, card);
    wizardCard.toggleVisibility(isVisible);
  }

  public notif_moveTower(args: { card: TowerCardBase; space_id: number, current_space_id: number }) {
    const { card, space_id, current_space_id } = args;
    const towerCard = new TowerCard(this.game, card);
    towerCard.move(space_id, current_space_id);
  }

  public notif_discardMove(args: { card: MoveCardBase }): void {
    const { card } = args;

    const moveCard = new MoveCard(this.game, card);
    moveCard.discard();
  }

  public notif_drawMove(args: { cards: MoveCardBase[] }): void {
    const { cards } = args;

    cards.forEach((card) => {
      const moveCard = new MoveCard(this.game, card);
      moveCard.draw();
    });
  }

  public notif_rollDie(args: { face: number }): void {
    const { face } = args;

    this.stocks.dice.rollDie({ id: 1, type: "die", face });
  }
}
