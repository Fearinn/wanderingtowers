/**
 * Your game interfaces
 */

declare class WanderingTowersGui extends GameGui {
    wtw: {
        managers: {
            zoom?: ZoomManager,
        },
    }
}

interface WanderingTowersGamedatas {
    current_player_id: string;
    decision: {decision_type: string};
    game_result_neutralized: string;
    gamestate: Gamestate;
    gamestates: { [gamestateId: number]: Gamestate };
    neutralized_player_id: string;
    notifications: {last_packet_id: string, move_nbr: string}
    playerorder: (string | number)[];
    players: { [playerId: number]: Player };
    tablespeed: string;

    towerCards: TowerCard[];
    wizardCards: WizardCard[];
    potionCards: PotionCard[];
    hand: MoveCard[];
}