/**
 * Your game interfaces
 */

declare class WanderingTowersGui extends Game {
  wtw: {
    managers: {
      zoom: ZoomManager;
      dice: DiceManager;
      moves: CardManager<BgaCard>;
      towers: CardManager<BgaCard>;
      wizards: CardManager<BgaCard>;
    };
    stocks: {
      dice: DiceStock;
      towers: TowerStocks;
      wizards: WizardStocks;
      moves: MoveStocks;
    };
  };

  performAction(
    action: ActionName,
    args?: object,
    options?: {
      checkAction?: boolean;
    }
  ): void;

  setClientState(
    newState: StateName,
    args: { descriptionmyturn: string; client_args?: object }
  ): void;
}

interface WanderingTowersGamedatas {
  current_player_id: string;
  decision: { decision_type: string };
  game_result_neutralized: string;
  gamestate: Gamestate;
  gamestates: { [gamestateId: number]: Gamestate };
  neutralized_player_id: string;
  notifications: { last_packet_id: string; move_nbr: string };
  playerorder: (string | number)[];
  players: { [playerId: number]: Player };
  tablespeed: string;

  diceFace: number;
  towerCards: BgaCard[];
  wizardCards: BgaCard[];
  potionCards: BgaCard[];
  moveDeck: MoveCardBase[];
  hand: MoveCardBase[];
}

type ActionName =
  | "actMoveWizard"
  | "actMoveTower"
  | "actRerollDice"
  | "actAcceptRoll";
