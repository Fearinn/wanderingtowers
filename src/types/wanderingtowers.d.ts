/**
 * Your game interfaces
 */

interface Player {
  turns_played: number;
}

interface Stocks {
  dice: DiceStock;
  towers: TowerStocks;
  wizards: WizardStocks;
  moves: MoveStocks;
  potions: PotionStocks;
  spells: SpellStocks;
}

interface Counters {
  spaces: {
    [space_id: number]: Counter;
  };
  [player_id: number]: {
    ravenskeep: Counter;
    turn: Counter;
  };
  discard: Counter;
}

declare class WanderingTowersGui extends Game {
  gamedatas: WanderingTowersGamedatas;

  wtw: {
    managers: {
      help?: HelpManager;
      zoom: ZoomManager;
      dice: DiceManager;
      moves: CardManager<MoveCard>;
      towers: CardManager<TowerCard>;
      wizards: CardManager<WizardCard>;
      spells: CardManager<SpellCard>;
    };
    stocks: Stocks;
    counters: Counters;
    globals: {
      moveCard?: MoveCard;
      towerCard?: TowerCard;
      spellCard?: SpellCard;
      maxTier?: number;
      minTier?: number;
      action?: ActionName;
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
  loopWizardStocks(
    callback: (stock: WizardSpaceStock, space_id: number, tier: number) => void
  ): void;

  soundPlay(sound_id: "pour" | "drink"): void;

  finalTurnBanner(): void;
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

  GAME_VERSION: number;
  SPELLS: {
    [spell_id: number]: SpellInfo;
  };
  diceFace: number;
  towerCards: TowerCard[];
  wizardCards: WizardCard[];
  potionCards: PotionCard[];
  moveDeckCount: number;
  moveDiscard: MoveCard[];
  moveDiscardCount: number;
  hand: MoveCard[];
  tierCounts: {
    [space_id: number]: number;
  };
  ravenskeepCounts: {
    [player_id: number]: number;
  };
  ravenskeepGoal: number;
  spellCards: SpellCard[];
  finalTurn: number;
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
  | "actAcceptRoll"
  | "actPushTower"
  | "actCastSpell"
  | "actPass"
  | "actSelectSpells";
