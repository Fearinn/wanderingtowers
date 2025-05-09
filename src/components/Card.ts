interface BgaCard {
  id: number;
  location: string;
  location_arg: number;
  type: number;
  type_arg?: number;
}

interface Card extends BgaCard {
  game: WanderingTowersGui;
  card: BgaCard;
}

class Card implements Card {
  constructor(game: WanderingTowersGui, card: BgaCard) {
    this.game = game;

    this.id = Number(card.id);
    this.location = card.location;
    this.location_arg = Number(card.location_arg);
    this.type = card.type;
    this.type_arg = Number(card.type_arg);

    this.card = {
      id: this.id,
      location: this.location,
      location_arg: this.location_arg,
      type: this.type,
      type_arg: this.type_arg,
    };
  }
}
