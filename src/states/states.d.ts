interface StateManager {
    game: WanderingTowersGui,
    stateName: StateName,
    statusBar: GameGui["statusBar"],
    enter(): void,
}

type StateName = "playerTurn" | "rerollDice";
