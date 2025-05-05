interface StateManager {
    game: WanderingTowersGui,
    stateName: StateName,
    statusBar: Game["statusBar"],
    enter(): void,
}

type StateName = "playerTurn" | "rerollDice";
