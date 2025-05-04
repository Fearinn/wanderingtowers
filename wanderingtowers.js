var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// @ts-ignore
WanderingTowersGui = (function () {
    // this hack required so we fake extend GameGui
    function WanderingTowersGui() { }
    return WanderingTowersGui;
})();
// Note: it does not really extend it in es6 way, you cannot call super you have to use dojo way
var WanderingTowers = /** @class */ (function (_super) {
    __extends(WanderingTowers, _super);
    // @ts-ignore
    function WanderingTowers() {
        var _this = this;
        return _this;
    }
    WanderingTowers.prototype.setup = function (gamedatas) {
        var zoomManager = new ZoomManager({
            element: document.getElementById("wtw_gameArea"),
            localStorageZoomKey: "wanderingtowers-zoom",
        });
        var diceManager = new DiceManager(this, {
            dieTypes: {
                die: new Die(),
            },
            perspective: 0,
        });
        var diceStock = new DiceStock(diceManager, document.getElementById("wtw_dice"));
        this.wtw = {
            managers: {
                zoom: zoomManager,
                dice: diceManager,
            },
            stocks: {
                dice: diceStock,
            },
        };
        diceStock.addDie({
            id: 1,
            type: "die",
            face: 3,
        });
        console.log(gamedatas.hand);
        this.setupNotifications();
    };
    WanderingTowers.prototype.onEnteringState = function (stateName, args) { };
    WanderingTowers.prototype.onLeavingState = function (stateName) { };
    WanderingTowers.prototype.onUpdateActionButtons = function (stateName, args) { };
    WanderingTowers.prototype.setupNotifications = function () {
        this.bgaSetupPromiseNotifications();
    };
    WanderingTowers.prototype.notif_rollDie = function (args) {
        var face = args.face;
        this.wtw.stocks.dice.rollDie({ id: 1, type: "die", face: face });
    };
    return WanderingTowers;
}(WanderingTowersGui));
define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock",
    "".concat(g_gamethemeurl, "modules/js/libs/bga-zoom.js"),
    "".concat(g_gamethemeurl, "modules/js/libs/bga-help.js"),
    "".concat(g_gamethemeurl, "modules/js/libs/bga-cards.js"),
    "".concat(g_gamethemeurl, "modules/js/libs/bga-dice.js"),
], function (dojo, declare) {
    return declare("bgagame.wanderingtowers", ebg.core.gamegui, new WanderingTowers());
});
var BgaDie6 = /** @class */ (function () {
    /**
     * Create the die type.
     *
     * @param settings the die settings
     */
    function BgaDie6(settings) {
        var _a;
        this.settings = settings;
        this.facesCount = 6;
        this.borderRadius = (_a = settings === null || settings === void 0 ? void 0 : settings.borderRadius) !== null && _a !== void 0 ? _a : 0;
    }
    /**
     * Allow to populate the main div of the die. You can set classes or dataset, if it's informations shared by all faces.
     *
     * @param die the die informations
     * @param element the die main Div element
     */
    BgaDie6.prototype.setupDieDiv = function (die, element) {
        element.classList.add("bga-dice_die6");
        element.style.setProperty("--bga-dice_border-radius", "".concat(this.borderRadius, "%"));
    };
    return BgaDie6;
}());
var Die = /** @class */ (function (_super) {
    __extends(Die, _super);
    function Die(settings) {
        if (settings === void 0) { settings = { borderRadius: 0 }; }
        return _super.call(this, settings) || this;
    }
    Die.prototype.setupDieDiv = function (die, element) {
        _super.prototype.setupDieDiv.call(this, die, element);
        element.classList.add("wtw_die");
    };
    return Die;
}(BgaDie6));
