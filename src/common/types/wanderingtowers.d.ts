/**
 * Your game interfaces
 */

interface Stocks {
  dice: DiceStock;
  towers: TowerStocks;
  wizards: WizardStocks;
  moves: MoveStocks;
}

interface Counters {
  spaces: {
    [space_id: number]: Counter;
  };
}

declare class WanderingTowersGui extends Game {
  wtw: {
    managers: {
      zoom: ZoomManager;
      dice: DiceManager;
      moves: CardManager<MoveCardBase>;
      towers: CardManager<TowerCardBase>;
      wizards: CardManager<WizardCardBase>;
    };
    stocks: Stocks;
    counters: Counters;
    globals: {
      moveCard?: MoveCardBase;
      towerCard?: TowerCardBase;
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

  getStateName(): StateName;

  addConfirmationButton(title: string, callback: () => void): HTMLButtonElement;
  removeConfirmationButton(): void;
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
  towerCards: TowerCardBase[];
  wizardCards: WizardCardBase[];
  potionCards: BgaCard[];
  moveDeck: MoveCardBase[];
  moveDiscard: MoveCardBase[];
  hand: MoveCardBase[];
  tierCounts: {
    [space_id: number]: number;
  };
}

interface WanderingTowersGamestate extends Gamestate {
  name: StateName;
}

type ActionName =
  | "actMoveWizard"
  | "actMoveTower"
  | "actRollDice"
  | "actRerollDice"
  | "actAcceptRoll";