class BgaDie6 implements BgaDieType {
  public facesCount: number = 6;
  protected borderRadius: number;

  /**
   * Create the die type.
   *
   * @param settings the die settings
   */
  constructor(protected settings?: BgaDie6Settings) {
    this.borderRadius = settings?.borderRadius ?? 0;
  }

  /**
   * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
   *
   * @param die the die informations
   * @param element the die main Div element
   */
  setupDieDiv(die: BgaDie, element: HTMLDivElement): void {
    element.classList.add("bga-dice_die6");
    element.style.setProperty(
      "--bga-dice_border-radius",
      `${this.borderRadius}%`
    );
  }
}

class Die extends BgaDie6 {
  constructor(settings: BgaDie6Settings = { borderRadius: 12 }) {
    super(settings);
  }

  setupDieDiv(die: BgaDie, element: HTMLDivElement) {
    super.setupDieDiv(die, element);
    element.classList.add("wtw_die");
  }
}
