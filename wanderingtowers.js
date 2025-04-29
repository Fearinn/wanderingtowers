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
GameGui = (function () {
    // this hack required so we fake extend GameGui
    function GameGui() { }
    return GameGui;
})();
// Note: it does not really extend it in es6 way, you cannot call super you have to use dojo way
var GameBody = /** @class */ (function (_super) {
    __extends(GameBody, _super);
    // @ts-ignore
    function GameBody() {
        var _this = this;
        return _this;
    }
    GameBody.prototype.setup = function (gamedatas) {
        this.setupNotifications();
    };
    GameBody.prototype.onEnteringState = function (stateName, args) { };
    GameBody.prototype.onLeavingState = function (stateName) { };
    GameBody.prototype.onUpdateActionButtons = function (stateName, args) { };
    GameBody.prototype.setupNotifications = function () { };
    return GameBody;
}(GameGui));
define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
], function (dojo, declare) {
    return declare("bgagame.wanderingtowers", ebg.core.gamegui, new GameBody());
});
