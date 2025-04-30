// @ts-ignore
GameGui = (function () {
  // this hack required so we fake extend GameGui
  function GameGui() {}
  return GameGui;
})();

// Note: it does not really extend it in es6 way, you cannot call super you have to use dojo way
class WanderingTowers extends GameGui {
  // @ts-ignore
  constructor() {}

  public setup(gamedatas: any) {
    this.setupNotifications();
  }
  public onEnteringState(stateName: string, args: any) {}
  public onLeavingState(stateName: string) {}
  public onUpdateActionButtons(stateName: string, args: any) {}
  public setupNotifications() {}
}
