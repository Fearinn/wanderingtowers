interface NotificationManager {
  game: WanderingTowersGui;
}

class NotificationManager implements NotificationManager {
  constructor(game: WanderingTowersGui) {
    this.game = game;
  }

  notif_moveWizard(args: { card: WizardCardBase; space_id: number }) {
    const { card, space_id } = args;
    const wizardCard = new WizardCard(this.game, card);
    wizardCard.place(space_id);
  }
}
