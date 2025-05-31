/**
 * Your game interfaces
 */

interface Stocks {
  dice: DiceStock;
  towers: TowerStocks;
  wizards: WizardStocks;
  moves: MoveStocks;
  potions: PotionStocks;
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
      moves: CardManager<MoveCard>;
      towers: CardManager<TowerCardBase>;
      wizards: CardManager<WizardCardBase>;
    };
    stocks: Stocks;
    counters: Counters;
    globals: {
      moveCard?: MoveCard;
      towerCard?: TowerCardBase;
      maxTier?: number;
    };
  };

  performAction(
    action: ActionName,
    args?: object,
    options?: {
      checkAction?: boolean;
    }
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
  potionCards: PotionCard[];
  moveDeck: MoveCard[];
  moveDiscard: MoveCard[];
  hand: MoveCard[];
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
  | "actMoveWizardDice"
  | "actMoveTowerDice"
  | "actRollDice"
  | "actRerollDice"
  | "actAcceptRoll";
