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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// @ts-ignore
WanderingTowersGui = (function () {
    // this hack required so we fake extend Game
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
        var _this = this;
        var zoomManager = new ZoomManager({
            element: document.getElementById("wtw_gameArea"),
            localStorageZoomKey: "wanderingtowers-zoom",
            zoomLevels: [
                0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5,
            ],
        });
        var diceManager = new DiceManager(this, {
            dieTypes: {
                die: new Die(),
            },
        });
        var diceStock = new DiceStock(diceManager, document.getElementById("wtw_dice"));
        diceStock.addDie({
            id: 1,
            type: "die",
            face: gamedatas.diceFace,
        });
        var towerManager = new CardManager(this, {
            getId: function (card) {
                return "wtw_tower-".concat(card.id);
            },
            selectedCardClass: "wtw_tower-selected",
            setupDiv: function (card, element) {
                var tower = new Tower(_this, card);
                tower.setupDiv(element);
            },
            setupFrontDiv: function (card, element) { },
        });
        var wizardManager = new CardManager(this, {
            getId: function (card) {
                return "wtw_wizard-".concat(card.id);
            },
            selectableCardClass: "wtw_wizard-selectable",
            selectedCardClass: "wtw_wizard-selected",
            setupDiv: function (card, element) {
                var wizard = new Wizard(_this, card);
                wizard.setupDiv(element);
            },
            setupFrontDiv: function (card, element) { },
        });
        var moveManager = new CardManager(this, {
            cardHeight: 100,
            cardWidth: 146,
            selectedCardClass: "wtw_move-selected",
            getId: function (card) {
                return "wtw_move-".concat(card.id);
            },
            setupDiv: function (card, element) {
                var move = new Move(_this, card);
                move.setupDiv(element);
            },
            setupFrontDiv: function (card, element) {
                var move = new Move(_this, card);
                move.setupFrontDiv(element);
            },
            setupBackDiv: function (card, element) {
                var move = new Move(_this, card);
                move.setupBackDiv(element);
            },
        });
        var potionManager = new CardManager(this, {
            getId: function (card) {
                return "wtw_potionCard-".concat(card.id);
            },
            setupDiv: function (card, element) {
                var potionCard = new Potion(_this, card);
                potionCard.setupDiv(element);
            },
            setupFrontDiv: function (card, element) {
                var potionCard = new Potion(_this, card);
                potionCard.setupFrontDiv(element);
            },
            setupBackDiv: function (card, element) {
                var potionCard = new Potion(_this, card);
                potionCard.setupBackDiv(element);
            },
        });
        var spellManager = new CardManager(this, {
            getId: function (card) {
                return "wtw_spell-".concat(card.type_arg);
            },
            selectedCardClass: "wtw_spell-selected",
            setupDiv: function (card, element) {
                var spellCard = new Spell(_this, card);
                spellCard.setupDiv(element);
            },
            setupFrontDiv: function (card, element) {
                var spellCard = new Spell(_this, card);
                spellCard.setupFrontDiv(element);
            },
        });
        var towerStocks = {
            spaces: {},
        };
        var wizardStocks = {
            spaces: {},
        };
        var counters = {
            spaces: {},
        };
        for (var space_id = 1; space_id <= 16; space_id++) {
            towerStocks.spaces[space_id] = new TowerSpaceStock(this, towerManager, space_id);
            var spaceElement = document.getElementById("wtw_spaceWizards-".concat(space_id));
            wizardStocks.spaces[space_id] = {};
            for (var tier = 0; tier <= 10; tier++) {
                spaceElement.insertAdjacentHTML("beforeend", "<div id=\"wtw_wizardTier-".concat(space_id, "-").concat(tier, "\" class=\"wtw_wizardTier\" \n          data-space=").concat(space_id, " data-tier=").concat(tier, "></div>"));
                wizardStocks.spaces[space_id][tier] = new WizardSpaceStock(this, wizardManager, space_id, tier);
            }
            var tierCount = gamedatas.tierCounts[space_id];
            counters.spaces[space_id] = new ebg.counter();
            counters.spaces[space_id].create("wtw_tierCounter-".concat(space_id));
            counters.spaces[space_id].setValue(tierCount);
            this.addTooltipHtml("wtw_tierCounter-".concat(space_id), "<span class=\"wtw_tooltipText\">".concat(_("number of towers at this space"), "</span>"));
        }
        if (this.getGameUserPreference(101) == 0) {
            var moveHandElement = document.getElementById("wtw_moveHand");
            document
                .getElementById("wtw_gameArea")
                .insertAdjacentElement("afterbegin", moveHandElement);
        }
        var moveStocks = {
            hand: new MoveHandStock(this, moveManager),
            deck: new Deck(moveManager, document.getElementById("wtw_moveDeck"), {
                counter: {
                    position: "top",
                    hideWhenEmpty: true,
                    extraClasses: "text-shadow wtw_deckCounter",
                },
            }),
            discard: new CardStock(moveManager, document.getElementById("wtw_moveDiscard"), { sort: sortFunction("location_arg") }),
        };
        for (var p_id in gamedatas.players) {
            var player_id = Number(p_id);
            this.getPlayerPanelElement(player_id).insertAdjacentHTML("beforeend", "<div id=\"wtw_moveVoid-".concat(player_id, "\" class=\"wtw_moveVoid\"></div>"));
            moveStocks[player_id] = {
                hand: new VoidStock(moveManager, document.getElementById("wtw_moveVoid-".concat(player_id))),
            };
        }
        var potionStocks = {
            void: new VoidStock(potionManager, document.getElementById("wtw_potionVoid")),
        };
        for (var p_id in gamedatas.players) {
            var player_id = Number(p_id);
            var playerPanelElement = this.getPlayerPanelElement(player_id);
            playerPanelElement.insertAdjacentHTML("beforeend", "<div id=\"wtw_ravenskeepCounter-".concat(player_id, "\" class=\"wtw_whiteblock wtw_ravenskeepCounter\">\n          <div id=\"wtw_ravenskeepCounterIcon-").concat(player_id, "\" class=\"wtw_ravenskeepCounterIcon\"></div>\n            <div class=\"wtw_ravenskeepCountContainer\">\n            <span id=\"wtw_ravenskeepCount-").concat(player_id, "\" class=\"wtw_ravenskeepCount\">0</span>\n            <span id=\"wtw_ravenskeepGoal-").concat(player_id, "\" class=\"wtw_ravenskeepGoal\">/").concat(gamedatas.ravenskeepGoal, "</span>\n          </div>\n          <div id=\"wtw_panelWizard-").concat(player_id, "\" class=\"wtw_card wtw_wizard wtw_wizard-panel\"></div>\n        </div>\n        <div id=\"wtw_potionCargo-").concat(player_id, "\" class=\"wtw_whiteblock wtw_potionCargo\"></div>"));
            this.addTooltipHtml("wtw_ravenskeepCounter-".concat(player_id), "<span class=\"wtw_tooltipText\">".concat(_("number of wizards in the Ravenskeep"), "</span>"));
            this.addTooltipHtml("wtw_potionCargo-".concat(player_id), "<span class=\"wtw_tooltipText\">".concat(_("potions remaining"), "</span>"));
            counters[player_id] = __assign(__assign({}, counters[player_id]), { ravenskeep: new ebg.counter() });
            counters[player_id].ravenskeep.create("wtw_ravenskeepCount-".concat(player_id));
            counters[player_id].ravenskeep.setValue(gamedatas.ravenskeepCounts[player_id]);
            potionStocks[player_id] = {
                cargo: new PotionCargoStock(this, potionManager, player_id),
            };
        }
        var spellStocks = {
            table: new CardStock(spellManager, document.getElementById("wtw_spells"), {
                sort: sortFunction("type_arg"),
            }),
        };
        this.wtw = {
            managers: {
                zoom: zoomManager,
                dice: diceManager,
                moves: moveManager,
                towers: towerManager,
                wizards: wizardManager,
                spells: spellManager,
            },
            stocks: {
                dice: diceStock,
                towers: towerStocks,
                wizards: wizardStocks,
                moves: moveStocks,
                potions: potionStocks,
                spells: spellStocks,
            },
            counters: counters,
            globals: {},
            material: {
                spells: {
                    1: {
                        name: _("Advance a Wizard"),
                        description: _("Move any 1 visible wizard 1 space clockwise"),
                    },
                    2: {
                        name: _("Headwind for a Wizard"),
                        description: _("Move any 1 visible wizard 1 space counterclockwise"),
                    },
                    3: {
                        name: _("Advance a Tower"),
                        description: _("Move any 1 tower (and everything atop it) 2 spaces clockwise"),
                    },
                    4: {
                        name: _("Headwind for a Tower"),
                        description: _("Move any 1 tower (and everything atop it) 2 spaces counterclockwise."),
                    },
                    5: {
                        name: _("Nudge a Ravenskeep"),
                        description: _("Move Ravenskeep clockwise or counterclockwise to the next empty space or empty tower top, whichever it encounters first in that direction"),
                    },
                    6: {
                        name: _("Swap a Tower"),
                        description: _("Swap the topmost tower (and wizards atop them) in 2 spaces"),
                    },
                    7: {
                        name: _("Free a Wizard"),
                        description: _("Lift any 1 tower to free 1 of your wizards from beneath it, placing the wizard on top of the stack"),
                    },
                },
            },
        };
        this.wtw.stocks.moves.deck.setCardNumber(gamedatas.moveDeckCount);
        gamedatas.towerCards.forEach(function (card) {
            var tower = new Tower(_this, card);
            tower.setup();
        });
        gamedatas.wizardCards.forEach(function (card) {
            var wizard = new Wizard(_this, card);
            wizard.setup();
        });
        gamedatas.potionCards.forEach(function (card) {
            var potion = new Potion(_this, card);
            potion.setup();
        });
        gamedatas.moveDiscard.forEach(function (card) {
            var move = new Move(_this, card);
            move.discard();
        });
        moveStocks.hand.setup(gamedatas.hand);
        gamedatas.spellCards.forEach(function (spellCard) {
            var spell = new Spell(_this, spellCard);
            spell.setup();
        });
        this.setupNotifications();
        BgaAutoFit.init();
        this.initObserver();
        this.buildHelp(gamedatas.spellCards);
        this.loadSounds();
    };
    WanderingTowers.prototype.onEnteringState = function (stateName, args) {
        if (!this.isCurrentPlayerActive()) {
            return;
        }
        switch (stateName) {
            case "playerTurn":
                new StPlayerTurn(this).enter(args.args);
                break;
            case "client_playMove":
                new StPlayMove(this).enter(args.args);
                break;
            case "client_pickMoveSide":
                new StPickMoveSide(this).enter(args.args);
                break;
            case "client_pickMoveWizard":
                new StPickMoveWizard(this).enter(args.args);
                break;
            case "client_pickMoveTower":
                new StPickMoveTower(this).enter(args.args);
                break;
            case "rerollDice":
                new StRerollDice(this).enter();
                break;
            case "client_pickMoveTier":
                new StPickMoveTier(this).enter();
                break;
            case "afterRoll":
                new StAfterRoll(this).enter(args.args);
                break;
            case "client_pickPushTower":
                new StPickPushTower(this).enter(args.args);
                break;
            case "client_castSpell":
                new StCastSpell(this).enter(args.args);
                break;
            case "client_pickSpellWizard":
                new StPickSpellWizard(this).enter(args.args);
                break;
            case "client_pickSpellTower":
                new StPickSpellTower(this).enter(args.args);
                break;
            case "client_pickSpellTier":
                new StPickSpellTier(this).enter();
                break;
            case "client_pickSpellDirection":
                new StPickSpellDirection(this).enter();
                break;
            case "spellSelection":
                new StSpellSelection(this).enter();
                break;
        }
    };
    WanderingTowers.prototype.onLeavingState = function (stateName) {
        switch (stateName) {
            case "client_playMove":
                new StPlayMove(this).leave();
                break;
            case "client_pickMoveSide":
                new StPickMoveSide(this).leave();
                break;
            case "client_pickMoveWizard":
                new StPickMoveWizard(this).leave();
                break;
            case "client_pickMoveTower":
                new StPickMoveTower(this).leave();
                break;
            case "client_pickMoveTier":
                new StPickMoveTier(this).leave();
                break;
            case "afterRoll":
                new StAfterRoll(this).leave();
                break;
            case "client_pickPushTower":
                new StPickPushTower(this).leave();
                break;
            case "client_castSpell":
                new StCastSpell(this).leave();
                break;
            case "client_pickSpellWizard":
                new StPickSpellWizard(this).leave();
                break;
            case "client_pickSpellTower":
                new StPickSpellTower(this).leave();
                break;
            case "client_pickSpellTier":
                new StPickSpellTier(this).leave();
                break;
            case "client_pickSpellDirection":
                new StPickSpellDirection(this).leave();
                break;
            case "spellSelection":
                new StSpellSelection(this).leave();
                break;
        }
    };
    WanderingTowers.prototype.onUpdateActionButtons = function (stateName, args) { };
    WanderingTowers.prototype.setupNotifications = function () {
        var notificationManager = new NotificationManager(this);
        this.bgaSetupPromiseNotifications({
            handlers: [notificationManager],
            minDuration: 1000,
            minDurationNoText: 1,
        });
    };
    WanderingTowers.prototype.addConfirmationButton = function (selection, callback) {
        return this.statusBar.addActionButton(this.format_string_recursive(_("confirm ${selection}"), {
            selection: _(selection),
        }), callback, { id: "wtw_confirmationButton" });
    };
    WanderingTowers.prototype.removeConfirmationButton = function () {
        var _a;
        (_a = document.getElementById("wtw_confirmationButton")) === null || _a === void 0 ? void 0 : _a.remove();
    };
    WanderingTowers.prototype.performAction = function (action, args, options) {
        var _this = this;
        if (args === void 0) { args = {}; }
        if (options === void 0) { options = { lock: true, checkAction: true }; }
        args.GAME_VERSION = this.gamedatas.GAME_VERSION;
        this.bgaPerformAction(action, args, options).catch(function (e) {
            _this.restoreServerGameState();
        });
    };
    WanderingTowers.prototype.getStateName = function () {
        return this.gamedatas.gamestate.name;
    };
    WanderingTowers.prototype.loopWizardStocks = function (callback) {
        var spaces = this.wtw.stocks.wizards.spaces;
        for (var i in spaces) {
            var space_id = Number(i);
            var space = spaces[space_id];
            for (var t in space) {
                var tier = Number(t);
                callback(space[tier], space_id, tier);
            }
        }
    };
    WanderingTowers.prototype.bgaFormatText = function (log, args) {
        var _a;
        try {
            if (log && args && !args.processed) {
                args.processed = true;
                for (var key in args) {
                    if (!key.includes("_label")) {
                        continue;
                    }
                    var arg = ((_a = args.i18n) === null || _a === void 0 ? void 0 : _a.includes(key)) ? _(args[key]) : args[key];
                    args[key] = "<span class=\"wtw_logHighlight\">".concat(arg, "</span>");
                }
            }
        }
        catch (e) {
            console.error(log, args, "Exception thrown", e.stack);
        }
        return { log: log, args: args };
    };
    WanderingTowers.prototype.initObserver = function () {
        var updateVisibility = function () {
            var towerClass = "wtw_tower-elevated";
            document
                .querySelectorAll(".wtw_spaceTowers")
                .forEach(function (spaceElement) {
                var space_id = Number(spaceElement.dataset.space);
                var towerElements = Array.from(spaceElement.children).filter(function (child) {
                    return !child.classList.contains("wtw_tierCounter");
                });
                var elevatedTier = towerElements.findIndex(function (sibling) {
                    return sibling.dataset.elevated;
                }) + 1;
                towerElements.forEach(function (towerElement, index) {
                    var tier = index + 1;
                    if (!elevatedTier) {
                        towerElement.classList.remove(towerClass);
                    }
                    if (towerElement.classList.contains(towerClass)) {
                        return;
                    }
                    var mustElevate = elevatedTier > 0 && elevatedTier < tier;
                    towerElement.classList.toggle(towerClass, mustElevate);
                });
                var tierClass = "wtw_wizardTier-elevated";
                var tierElements = document.querySelectorAll("[data-tier][data-space=\"".concat(space_id, "\"]:not(:empty)"));
                tierElements.forEach(function (tierElement) {
                    var _a;
                    var tier = Number(tierElement.dataset.tier);
                    var towerAbove = towerElements[tier];
                    var revealedByElevation = !((_a = towerElements[tier - 1]) === null || _a === void 0 ? void 0 : _a.classList.contains(towerClass)) &&
                        (towerAbove === null || towerAbove === void 0 ? void 0 : towerAbove.classList.contains(towerClass)) &&
                        (towerAbove === null || towerAbove === void 0 ? void 0 : towerAbove.dataset.elevated) === "1";
                    tierElement.classList.toggle("wtw_wizardTier-imprisoned", !revealedByElevation && towerElements.length > tier);
                    if (elevatedTier === 0) {
                        tierElements.forEach(function (tierElement) {
                            tierElement.classList.remove(tierClass);
                        });
                        return;
                    }
                    var mustElevate = tier >= elevatedTier;
                    tierElement.classList.toggle(tierClass, mustElevate);
                });
            });
        };
        var observer = new MutationObserver(updateVisibility);
        observer.observe(document.getElementById("wtw_spacesContainer"), {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-elevated"],
        });
        updateVisibility();
    };
    WanderingTowers.prototype.buildHelp = function (spellCards) {
        var _this = this;
        var cards = spellCards
            .filter(function (spellCard) {
            return spellCard.location === "table";
        })
            .sort(function (a, b) {
            var spell_a = new Spell(_this, a);
            var spell_b = new Spell(_this, b);
            return spell_a.id - spell_b.id;
        });
        var spellHelp = document.createElement("div");
        spellHelp.classList.add("wtw_spellHelp");
        cards.forEach(function (spellCard) {
            var spell = new Spell(_this, spellCard);
            var spellTooltip = spell.createTooltip();
            spellHelp.insertAdjacentHTML("beforeend", spellTooltip);
        });
        var unfoldedHelp = "<div id=\"wtw_unfoldedHelp\" class=\"wtw_unfoldedHelp\"> \n      ".concat(spellHelp.outerHTML, "\n    </div>");
        this.wtw.managers.help = new HelpManager(this, {
            buttons: [
                new BgaHelpExpandableButton({
                    // @ts-ignore
                    title: _("spell reference"),
                    foldedHtml: "<span class=\"wtw_foldedHelp\">?</span>",
                    unfoldedHtml: unfoldedHelp,
                }),
            ],
        });
    };
    WanderingTowers.prototype.soundPlay = function (sound_id) {
        if (this.getGameUserPreference(102) == 1) {
            this.disableNextMoveSound();
            this.sounds.play(sound_id);
        }
    };
    WanderingTowers.prototype.loadSounds = function () {
        var _this = this;
        var sounds_ids = ["pour", "drink"];
        sounds_ids.forEach(function (sound_id) {
            _this.sounds.load(sound_id);
        });
    };
    return WanderingTowers;
}(WanderingTowersGui));
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var DEFAULT_ZOOM_LEVELS = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
function throttle(callback, delay) {
    var last;
    var timer;
    return function () {
        var context = this;
        var now = +new Date();
        var args = arguments;
        if (last && now < last + delay) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                callback.apply(context, args);
            }, delay);
        }
        else {
            last = now;
            callback.apply(context, args);
        }
    };
}
var advThrottle = function (func, delay, options) {
    if (options === void 0) { options = { leading: true, trailing: false }; }
    var timer = null, lastRan = null, trailingArgs = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer) { //called within cooldown period
            lastRan = this; //update context
            trailingArgs = args; //save for later
            return;
        }
        if (options.leading) { // if leading
            func.call.apply(// if leading
            func, __spreadArray([this], args, false)); //call the 1st instance
        }
        else { // else it's trailing
            lastRan = this; //update context
            trailingArgs = args; //save for later
        }
        var coolDownPeriodComplete = function () {
            if (options.trailing && trailingArgs) { // if trailing and the trailing args exist
                func.call.apply(// if trailing and the trailing args exist
                func, __spreadArray([lastRan], trailingArgs, false)); //invoke the instance with stored context "lastRan"
                lastRan = null; //reset the status of lastRan
                trailingArgs = null; //reset trailing arguments
                timer = setTimeout(coolDownPeriodComplete, delay); //clear the timout
            }
            else {
                timer = null; // reset timer
            }
        };
        timer = setTimeout(coolDownPeriodComplete, delay);
    };
};
var ZoomManager = /** @class */ (function () {
    /**
     * Place the settings.element in a zoom wrapper and init zoomControls.
     *
     * @param settings: a `ZoomManagerSettings` object
     */
    function ZoomManager(settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this.settings = settings;
        if (!settings.element) {
            throw new DOMException('You need to set the element to wrap in the zoom element');
        }
        this._zoomLevels = (_a = settings.zoomLevels) !== null && _a !== void 0 ? _a : DEFAULT_ZOOM_LEVELS;
        this._zoom = this.settings.defaultZoom || 1;
        if (this.settings.localStorageZoomKey) {
            var zoomStr = localStorage.getItem(this.settings.localStorageZoomKey);
            if (zoomStr) {
                this._zoom = Number(zoomStr);
            }
        }
        this.wrapper = document.createElement('div');
        this.wrapper.id = 'bga-zoom-wrapper';
        this.wrapElement(this.wrapper, settings.element);
        this.wrapper.appendChild(settings.element);
        settings.element.classList.add('bga-zoom-inner');
        if ((_b = settings.smooth) !== null && _b !== void 0 ? _b : true) {
            settings.element.dataset.smooth = 'true';
            settings.element.addEventListener('transitionend', advThrottle(function () { return _this.zoomOrDimensionChanged(); }, this.throttleTime, { leading: true, trailing: true, }));
        }
        if ((_d = (_c = settings.zoomControls) === null || _c === void 0 ? void 0 : _c.visible) !== null && _d !== void 0 ? _d : true) {
            this.initZoomControls(settings);
        }
        if (this._zoom !== 1) {
            this.setZoom(this._zoom);
        }
        this.throttleTime = (_e = settings.throttleTime) !== null && _e !== void 0 ? _e : 100;
        window.addEventListener('resize', advThrottle(function () {
            var _a;
            _this.zoomOrDimensionChanged();
            if ((_a = _this.settings.autoZoom) === null || _a === void 0 ? void 0 : _a.expectedWidth) {
                _this.setAutoZoom();
            }
        }, this.throttleTime, { leading: true, trailing: true, }));
        if (window.ResizeObserver) {
            new ResizeObserver(advThrottle(function () { return _this.zoomOrDimensionChanged(); }, this.throttleTime, { leading: true, trailing: true, })).observe(settings.element);
        }
        if ((_f = this.settings.autoZoom) === null || _f === void 0 ? void 0 : _f.expectedWidth) {
            this.setAutoZoom();
        }
    }
    Object.defineProperty(ZoomManager.prototype, "zoom", {
        /**
         * Returns the zoom level
         */
        get: function () {
            return this._zoom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomManager.prototype, "zoomLevels", {
        /**
         * Returns the zoom levels
         */
        get: function () {
            return this._zoomLevels;
        },
        enumerable: false,
        configurable: true
    });
    ZoomManager.prototype.setAutoZoom = function () {
        var _this = this;
        var _a, _b, _c;
        var zoomWrapperWidth = document.getElementById('bga-zoom-wrapper').clientWidth;
        if (!zoomWrapperWidth) {
            setTimeout(function () { return _this.setAutoZoom(); }, 200);
            return;
        }
        var expectedWidth = (_a = this.settings.autoZoom) === null || _a === void 0 ? void 0 : _a.expectedWidth;
        var newZoom = this.zoom;
        while (newZoom > this._zoomLevels[0] && newZoom > ((_c = (_b = this.settings.autoZoom) === null || _b === void 0 ? void 0 : _b.minZoomLevel) !== null && _c !== void 0 ? _c : 0) && zoomWrapperWidth / newZoom < expectedWidth) {
            newZoom = this._zoomLevels[this._zoomLevels.indexOf(newZoom) - 1];
        }
        if (this._zoom == newZoom) {
            if (this.settings.localStorageZoomKey) {
                localStorage.setItem(this.settings.localStorageZoomKey, '' + this._zoom);
            }
        }
        else {
            this.setZoom(newZoom);
        }
    };
    /**
     * Sets the available zoomLevels and new zoom to the provided values.
     * @param zoomLevels the new array of zoomLevels that can be used.
     * @param newZoom if provided the zoom will be set to this value, if not the last element of the zoomLevels array will be set as the new zoom
     */
    ZoomManager.prototype.setZoomLevels = function (zoomLevels, newZoom) {
        if (!zoomLevels || zoomLevels.length <= 0) {
            return;
        }
        this._zoomLevels = zoomLevels;
        var zoomIndex = newZoom && zoomLevels.includes(newZoom) ? this._zoomLevels.indexOf(newZoom) : this._zoomLevels.length - 1;
        this.setZoom(this._zoomLevels[zoomIndex]);
    };
    /**
     * Set the zoom level. Ideally, use a zoom level in the zoomLevels range.
     * @param zoom zool level
     */
    ZoomManager.prototype.setZoom = function (zoom) {
        var _a, _b, _c, _d;
        if (zoom === void 0) { zoom = 1; }
        this._zoom = zoom;
        if (this.settings.localStorageZoomKey) {
            localStorage.setItem(this.settings.localStorageZoomKey, '' + this._zoom);
        }
        var newIndex = this._zoomLevels.indexOf(this._zoom);
        (_a = this.zoomInButton) === null || _a === void 0 ? void 0 : _a.classList.toggle('disabled', newIndex === this._zoomLevels.length - 1);
        (_b = this.zoomOutButton) === null || _b === void 0 ? void 0 : _b.classList.toggle('disabled', newIndex === 0);
        this.settings.element.style.transform = zoom === 1 ? '' : "scale(".concat(zoom, ")");
        (_d = (_c = this.settings).onZoomChange) === null || _d === void 0 ? void 0 : _d.call(_c, this._zoom);
        this.zoomOrDimensionChanged();
    };
    /**
     * Call this method for the browsers not supporting ResizeObserver, everytime the table height changes, if you know it.
     * If the browsert is recent enough (>= Safari 13.1) it will just be ignored.
     */
    ZoomManager.prototype.manualHeightUpdate = function () {
        if (!window.ResizeObserver) {
            this.zoomOrDimensionChanged();
        }
    };
    /**
     * Everytime the element dimensions changes, we update the style. And call the optional callback.
     * Unsafe method as this is not protected by throttle. Surround with  `advThrottle(() => this.zoomOrDimensionChanged(), this.throttleTime, { leading: true, trailing: true, })` to avoid spamming recomputation.
     */
    ZoomManager.prototype.zoomOrDimensionChanged = function () {
        var _a, _b;
        this.settings.element.style.width = "".concat(this.wrapper.offsetWidth / this._zoom, "px");
        this.wrapper.style.height = "".concat(this.settings.element.offsetHeight * this._zoom, "px");
        (_b = (_a = this.settings).onDimensionsChange) === null || _b === void 0 ? void 0 : _b.call(_a, this._zoom);
    };
    /**
     * Simulates a click on the Zoom-in button.
     */
    ZoomManager.prototype.zoomIn = function () {
        if (this._zoom === this._zoomLevels[this._zoomLevels.length - 1]) {
            return;
        }
        var newIndex = this._zoomLevels.indexOf(this._zoom) + 1;
        this.setZoom(newIndex === -1 ? 1 : this._zoomLevels[newIndex]);
    };
    /**
     * Simulates a click on the Zoom-out button.
     */
    ZoomManager.prototype.zoomOut = function () {
        if (this._zoom === this._zoomLevels[0]) {
            return;
        }
        var newIndex = this._zoomLevels.indexOf(this._zoom) - 1;
        this.setZoom(newIndex === -1 ? 1 : this._zoomLevels[newIndex]);
    };
    /**
     * Changes the color of the zoom controls.
     */
    ZoomManager.prototype.setZoomControlsColor = function (color) {
        if (this.zoomControls) {
            this.zoomControls.dataset.color = color;
        }
    };
    /**
     * Set-up the zoom controls
     * @param settings a `ZoomManagerSettings` object.
     */
    ZoomManager.prototype.initZoomControls = function (settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this.zoomControls = document.createElement('div');
        this.zoomControls.id = 'bga-zoom-controls';
        this.zoomControls.dataset.position = (_b = (_a = settings.zoomControls) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'top-right';
        this.zoomOutButton = document.createElement('button');
        this.zoomOutButton.type = 'button';
        this.zoomOutButton.addEventListener('click', function () { return _this.zoomOut(); });
        if ((_c = settings.zoomControls) === null || _c === void 0 ? void 0 : _c.customZoomOutElement) {
            settings.zoomControls.customZoomOutElement(this.zoomOutButton);
        }
        else {
            this.zoomOutButton.classList.add("bga-zoom-out-icon");
        }
        this.zoomInButton = document.createElement('button');
        this.zoomInButton.type = 'button';
        this.zoomInButton.addEventListener('click', function () { return _this.zoomIn(); });
        if ((_d = settings.zoomControls) === null || _d === void 0 ? void 0 : _d.customZoomInElement) {
            settings.zoomControls.customZoomInElement(this.zoomInButton);
        }
        else {
            this.zoomInButton.classList.add("bga-zoom-in-icon");
        }
        this.zoomControls.appendChild(this.zoomOutButton);
        this.zoomControls.appendChild(this.zoomInButton);
        this.wrapper.appendChild(this.zoomControls);
        this.setZoomControlsColor((_f = (_e = settings.zoomControls) === null || _e === void 0 ? void 0 : _e.color) !== null && _f !== void 0 ? _f : 'black');
    };
    /**
     * Wraps an element around an existing DOM element
     * @param wrapper the wrapper element
     * @param element the existing element
     */
    ZoomManager.prototype.wrapElement = function (wrapper, element) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    };
    return ZoomManager;
}());
var BgaHelpButton = /** @class */ (function () {
    function BgaHelpButton() {
    }
    return BgaHelpButton;
}());
var BgaHelpPopinButton = /** @class */ (function (_super) {
    __extends(BgaHelpPopinButton, _super);
    function BgaHelpPopinButton(settings) {
        var _this = _super.call(this) || this;
        _this.settings = settings;
        return _this;
    }
    BgaHelpPopinButton.prototype.add = function (toElement) {
        var _a;
        var _this = this;
        var button = document.createElement('button');
        (_a = button.classList).add.apply(_a, __spreadArray(['bga-help_button', 'bga-help_popin-button'], (this.settings.buttonExtraClasses ? this.settings.buttonExtraClasses.split(/\s+/g) : []), false));
        button.innerHTML = "?";
        if (this.settings.buttonBackground) {
            button.style.setProperty('--background', this.settings.buttonBackground);
        }
        if (this.settings.buttonColor) {
            button.style.setProperty('--color', this.settings.buttonColor);
        }
        toElement.appendChild(button);
        button.addEventListener('click', function () { return _this.showHelp(); });
    };
    BgaHelpPopinButton.prototype.showHelp = function () {
        var _a, _b, _c;
        var popinDialog = new window.ebg.popindialog();
        popinDialog.create('bgaHelpDialog');
        popinDialog.setTitle(this.settings.title);
        popinDialog.setContent("<div id=\"help-dialog-content\">".concat((_a = this.settings.html) !== null && _a !== void 0 ? _a : '', "</div>"));
        (_c = (_b = this.settings).onPopinCreated) === null || _c === void 0 ? void 0 : _c.call(_b, document.getElementById('help-dialog-content'));
        popinDialog.show();
    };
    return BgaHelpPopinButton;
}(BgaHelpButton));
var BgaHelpExpandableButton = /** @class */ (function (_super) {
    __extends(BgaHelpExpandableButton, _super);
    function BgaHelpExpandableButton(settings) {
        var _this = _super.call(this) || this;
        _this.settings = settings;
        return _this;
    }
    BgaHelpExpandableButton.prototype.add = function (toElement) {
        var _a;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        var folded = (_b = this.settings.defaultFolded) !== null && _b !== void 0 ? _b : true;
        if (this.settings.localStorageFoldedKey) {
            var localStorageValue = localStorage.getItem(this.settings.localStorageFoldedKey);
            if (localStorageValue) {
                folded = localStorageValue == 'true';
            }
        }
        var button = document.createElement('button');
        button.dataset.folded = folded.toString();
        (_a = button.classList).add.apply(_a, __spreadArray(['bga-help_button', 'bga-help_expandable-button'], (this.settings.buttonExtraClasses ? this.settings.buttonExtraClasses.split(/\s+/g) : []), false));
        button.innerHTML = "\n            <div class=\"bga-help_folded-content ".concat(((_c = this.settings.foldedContentExtraClasses) !== null && _c !== void 0 ? _c : '').split(/\s+/g), "\">").concat((_d = this.settings.foldedHtml) !== null && _d !== void 0 ? _d : '', "</div>\n            <div class=\"bga-help_unfolded-content  ").concat(((_e = this.settings.unfoldedContentExtraClasses) !== null && _e !== void 0 ? _e : '').split(/\s+/g), "\">").concat((_f = this.settings.unfoldedHtml) !== null && _f !== void 0 ? _f : '', "</div>\n        ");
        button.style.setProperty('--expanded-width', (_g = this.settings.expandedWidth) !== null && _g !== void 0 ? _g : 'auto');
        button.style.setProperty('--expanded-height', (_h = this.settings.expandedHeight) !== null && _h !== void 0 ? _h : 'auto');
        button.style.setProperty('--expanded-radius', (_j = this.settings.expandedRadius) !== null && _j !== void 0 ? _j : '10px');
        toElement.appendChild(button);
        button.addEventListener('click', function () {
            button.dataset.folded = button.dataset.folded == 'true' ? 'false' : 'true';
            if (_this.settings.localStorageFoldedKey) {
                localStorage.setItem(_this.settings.localStorageFoldedKey, button.dataset.folded);
            }
        });
    };
    return BgaHelpExpandableButton;
}(BgaHelpButton));
var HelpManager = /** @class */ (function () {
    function HelpManager(game, settings) {
        this.game = game;
        if (!(settings === null || settings === void 0 ? void 0 : settings.buttons)) {
            throw new Error('HelpManager need a `buttons` list in the settings.');
        }
        var leftSide = document.getElementById('left-side');
        var buttons = document.createElement('div');
        buttons.id = "bga-help_buttons";
        leftSide.appendChild(buttons);
        settings.buttons.forEach(function (button) { return button.add(buttons); });
    }
    return HelpManager;
}());
var BgaAnimation = /** @class */ (function () {
    function BgaAnimation(animationFunction, settings) {
        this.animationFunction = animationFunction;
        this.settings = settings;
        this.played = null;
        this.result = null;
        this.playWhenNoAnimation = false;
    }
    return BgaAnimation;
}());
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function attachWithAnimation(animationManager, animation) {
    var _a;
    var settings = animation.settings;
    var element = settings.animation.settings.element;
    var fromRect = element.getBoundingClientRect();
    settings.animation.settings.fromRect = fromRect;
    settings.attachElement.appendChild(element);
    (_a = settings.afterAttach) === null || _a === void 0 ? void 0 : _a.call(settings, element, settings.attachElement);
    return animationManager.play(settings.animation);
}
var BgaAttachWithAnimation = /** @class */ (function (_super) {
    __extends(BgaAttachWithAnimation, _super);
    function BgaAttachWithAnimation(settings) {
        var _this = _super.call(this, attachWithAnimation, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaAttachWithAnimation;
}(BgaAnimation));
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function cumulatedAnimations(animationManager, animation) {
    return animationManager.playSequence(animation.settings.animations);
}
var BgaCumulatedAnimation = /** @class */ (function (_super) {
    __extends(BgaCumulatedAnimation, _super);
    function BgaCumulatedAnimation(settings) {
        var _this = _super.call(this, cumulatedAnimations, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaCumulatedAnimation;
}(BgaAnimation));
/**
 * Just does nothing for the duration
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function pauseAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a;
        var settings = animation.settings;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        setTimeout(function () { return success(); }, duration);
    });
    return promise;
}
var BgaPauseAnimation = /** @class */ (function (_super) {
    __extends(BgaPauseAnimation, _super);
    function BgaPauseAnimation(settings) {
        return _super.call(this, pauseAnimation, settings) || this;
    }
    return BgaPauseAnimation;
}(BgaAnimation));
/**
 * Show the element at the center of the screen
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function showScreenCenterAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d;
        var settings = animation.settings;
        var element = settings.element;
        var elementBR = element.getBoundingClientRect();
        var xCenter = (elementBR.left + elementBR.right) / 2;
        var yCenter = (elementBR.top + elementBR.bottom) / 2;
        var x = xCenter - (window.innerWidth / 2);
        var y = yCenter - (window.innerHeight / 2);
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg)");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaShowScreenCenterAnimation = /** @class */ (function (_super) {
    __extends(BgaShowScreenCenterAnimation, _super);
    function BgaShowScreenCenterAnimation(settings) {
        return _super.call(this, showScreenCenterAnimation, settings) || this;
    }
    return BgaShowScreenCenterAnimation;
}(BgaAnimation));
/**
 * Slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e;
        var settings = animation.settings;
        var element = settings.element;
        var _f = getDeltaCoordinates(element, settings), x = _f.x, y = _f.y;
        var duration = (_a = settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        element.style.transition = null;
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg)");
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionCancel);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = (_e = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _e !== void 0 ? _e : null;
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideAnimation, _super);
    function BgaSlideAnimation(settings) {
        return _super.call(this, slideAnimation, settings) || this;
    }
    return BgaSlideAnimation;
}(BgaAnimation));
/**
 * Slide of the element from destination to origin.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideToAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e;
        var settings = animation.settings;
        var element = settings.element;
        var _f = getDeltaCoordinates(element, settings), x = _f.x, y = _f.y;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg) scale(").concat((_e = settings.scale) !== null && _e !== void 0 ? _e : 1, ")");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideToAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideToAnimation, _super);
    function BgaSlideToAnimation(settings) {
        return _super.call(this, slideToAnimation, settings) || this;
    }
    return BgaSlideToAnimation;
}(BgaAnimation));
function shouldAnimate(settings) {
    var _a;
    return document.visibilityState !== 'hidden' && !((_a = settings === null || settings === void 0 ? void 0 : settings.game) === null || _a === void 0 ? void 0 : _a.instantaneousMode);
}
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
function getDeltaCoordinates(element, settings) {
    var _a;
    if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
        throw new Error("[bga-animation] fromDelta, fromRect or fromElement need to be set");
    }
    var x = 0;
    var y = 0;
    if (settings.fromDelta) {
        x = settings.fromDelta.x;
        y = settings.fromDelta.y;
    }
    else {
        var originBR = (_a = settings.fromRect) !== null && _a !== void 0 ? _a : settings.fromElement.getBoundingClientRect();
        // TODO make it an option ?
        var originalTransform = element.style.transform;
        element.style.transform = '';
        var destinationBR = element.getBoundingClientRect();
        element.style.transform = originalTransform;
        x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
        y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
    }
    if (settings.scale) {
        x /= settings.scale;
        y /= settings.scale;
    }
    return { x: x, y: y };
}
function logAnimation(animationManager, animation) {
    var settings = animation.settings;
    var element = settings.element;
    if (element) {
        console.log(animation, settings, element, element.getBoundingClientRect(), element.style.transform);
    }
    else {
        console.log(animation, settings);
    }
    return Promise.resolve(false);
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var AnimationManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    function AnimationManager(game, settings) {
        this.game = game;
        this.settings = settings;
        this.zoomManager = settings === null || settings === void 0 ? void 0 : settings.zoomManager;
        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }
    AnimationManager.prototype.getZoomManager = function () {
        return this.zoomManager;
    };
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    AnimationManager.prototype.setZoomManager = function (zoomManager) {
        this.zoomManager = zoomManager;
    };
    AnimationManager.prototype.getSettings = function () {
        return this.settings;
    };
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    AnimationManager.prototype.animationsActive = function () {
        return document.visibilityState !== 'hidden' && !this.game.instantaneousMode;
    };
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    AnimationManager.prototype.play = function (animation) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __awaiter(this, void 0, void 0, function () {
            var settings, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        animation.played = animation.playWhenNoAnimation || this.animationsActive();
                        if (!animation.played) return [3 /*break*/, 2];
                        settings = animation.settings;
                        (_a = settings.animationStart) === null || _a === void 0 ? void 0 : _a.call(settings, animation);
                        (_b = settings.element) === null || _b === void 0 ? void 0 : _b.classList.add((_c = settings.animationClass) !== null && _c !== void 0 ? _c : 'bga-animations_animated');
                        animation.settings = __assign({ duration: (_g = (_e = (_d = animation.settings) === null || _d === void 0 ? void 0 : _d.duration) !== null && _e !== void 0 ? _e : (_f = this.settings) === null || _f === void 0 ? void 0 : _f.duration) !== null && _g !== void 0 ? _g : 500, scale: (_l = (_j = (_h = animation.settings) === null || _h === void 0 ? void 0 : _h.scale) !== null && _j !== void 0 ? _j : (_k = this.zoomManager) === null || _k === void 0 ? void 0 : _k.zoom) !== null && _l !== void 0 ? _l : undefined }, animation.settings);
                        _r = animation;
                        return [4 /*yield*/, animation.animationFunction(this, animation)];
                    case 1:
                        _r.result = _s.sent();
                        (_o = (_m = animation.settings).animationEnd) === null || _o === void 0 ? void 0 : _o.call(_m, animation);
                        (_p = settings.element) === null || _p === void 0 ? void 0 : _p.classList.remove((_q = settings.animationClass) !== null && _q !== void 0 ? _q : 'bga-animations_animated');
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, Promise.resolve(animation)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playParallel = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(animations.map(function (animation) { return _this.play(animation); }))];
            });
        });
    };
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playSequence = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var result, others;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!animations.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.play(animations[0])];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.playSequence(animations.slice(1))];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, __spreadArray([result], others, true)];
                    case 3: return [2 /*return*/, Promise.resolve([])];
                }
            });
        });
    };
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playWithDelay = function (animations, delay) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (success) {
                    var promises = [];
                    var _loop_1 = function (i) {
                        setTimeout(function () {
                            promises.push(_this.play(animations[i]));
                            if (i == animations.length - 1) {
                                Promise.all(promises).then(function (result) {
                                    success(result);
                                });
                            }
                        }, i * delay);
                    };
                    for (var i = 0; i < animations.length; i++) {
                        _loop_1(i);
                    }
                });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    AnimationManager.prototype.attachWithAnimation = function (animation, attachElement) {
        var attachWithAnimation = new BgaAttachWithAnimation({
            animation: animation,
            attachElement: attachElement
        });
        return this.play(attachWithAnimation);
    };
    return AnimationManager;
}());
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
var CardStock = /** @class */ (function () {
    /**
     * Creates the stock and register it on the manager.
     *
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function CardStock(manager, element, settings) {
        this.manager = manager;
        this.element = element;
        this.settings = settings;
        this.cards = [];
        this.selectedCards = [];
        this.selectionMode = 'none';
        manager.addStock(this);
        element === null || element === void 0 ? void 0 : element.classList.add('card-stock' /*, this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()* doesn't work in production because of minification */);
        this.bindClick();
        this.sort = settings === null || settings === void 0 ? void 0 : settings.sort;
    }
    /**
     * Removes the stock and unregister it on the manager.
     */
    CardStock.prototype.remove = function () {
        var _a;
        this.manager.removeStock(this);
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.remove();
    };
    /**
     * @returns the cards on the stock
     */
    CardStock.prototype.getCards = function () {
        return this.cards.slice();
    };
    /**
     * @returns if the stock is empty
     */
    CardStock.prototype.isEmpty = function () {
        return !this.cards.length;
    };
    /**
     * @returns the selected cards
     */
    CardStock.prototype.getSelection = function () {
        return this.selectedCards.slice();
    };
    /**
     * @returns the selected cards
     */
    CardStock.prototype.isSelected = function (card) {
        var _this = this;
        return this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    /**
     * @param card a card
     * @returns if the card is present in the stock
     */
    CardStock.prototype.contains = function (card) {
        var _this = this;
        return this.cards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    /**
     * @param card a card in the stock
     * @returns the HTML element generated for the card
     */
    CardStock.prototype.getCardElement = function (card) {
        return this.manager.getCardElement(card);
    };
    /**
     * Checks if the card can be added. By default, only if it isn't already present in the stock.
     *
     * @param card the card to add
     * @param settings the addCard settings
     * @returns if the card can be added
     */
    CardStock.prototype.canAddCard = function (card, settings) {
        return !this.contains(card);
    };
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    CardStock.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        if (!this.canAddCard(card, settings)) {
            return Promise.resolve(false);
        }
        var promise;
        // we check if card is in a stock
        var originStock = this.manager.getCardStock(card);
        var index = this.getNewCardIndex(card);
        var settingsWithIndex = __assign({ index: index }, (settings !== null && settings !== void 0 ? settings : {}));
        var updateInformations = (_a = settingsWithIndex.updateInformations) !== null && _a !== void 0 ? _a : true;
        var needsCreation = true;
        if (originStock === null || originStock === void 0 ? void 0 : originStock.contains(card)) {
            var element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, __assign(__assign({}, animation), { fromStock: originStock }), settingsWithIndex);
                needsCreation = false;
                if (!updateInformations) {
                    element.dataset.side = ((_b = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _b !== void 0 ? _b : this.manager.isCardVisible(card)) ? 'front' : 'back';
                }
            }
        }
        else if ((_c = animation === null || animation === void 0 ? void 0 : animation.fromStock) === null || _c === void 0 ? void 0 : _c.contains(card)) {
            var element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, animation, settingsWithIndex);
                needsCreation = false;
            }
        }
        if (needsCreation) {
            var element = this.getCardElement(card);
            if (needsCreation && element) {
                console.warn("Card ".concat(this.manager.getId(card), " already exists, not re-created."));
            }
            // if the card comes from a stock but is not found in this stock, the card is probably hudden (deck with a fake top card)
            var fromBackSide = !(settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) && !(animation === null || animation === void 0 ? void 0 : animation.originalSide) && (animation === null || animation === void 0 ? void 0 : animation.fromStock) && !((_d = animation === null || animation === void 0 ? void 0 : animation.fromStock) === null || _d === void 0 ? void 0 : _d.contains(card));
            var createdVisible = fromBackSide ? false : (_e = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _e !== void 0 ? _e : this.manager.isCardVisible(card);
            var newElement = element !== null && element !== void 0 ? element : this.manager.createCardElement(card, createdVisible);
            promise = this.moveFromElement(card, newElement, animation, settingsWithIndex);
        }
        if (settingsWithIndex.index !== null && settingsWithIndex.index !== undefined) {
            this.cards.splice(index, 0, card);
        }
        else {
            this.cards.push(card);
        }
        if (updateInformations) { // after splice/push
            this.manager.updateCardInformations(card);
        }
        if (!promise) {
            console.warn("CardStock.addCard didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if (this.selectionMode !== 'none') {
            // make selectable only at the end of the animation
            promise.then(function () { var _a; return _this.setSelectableCard(card, (_a = settingsWithIndex.selectable) !== null && _a !== void 0 ? _a : true); });
        }
        return promise;
    };
    CardStock.prototype.getNewCardIndex = function (card) {
        if (this.sort) {
            var otherCards = this.getCards();
            for (var i = 0; i < otherCards.length; i++) {
                var otherCard = otherCards[i];
                if (this.sort(card, otherCard) < 0) {
                    return i;
                }
            }
            return otherCards.length;
        }
        else {
            return undefined;
        }
    };
    CardStock.prototype.addCardElementToParent = function (cardElement, settings) {
        var _a;
        var parent = (_a = settings === null || settings === void 0 ? void 0 : settings.forceToElement) !== null && _a !== void 0 ? _a : this.element;
        if ((settings === null || settings === void 0 ? void 0 : settings.index) === null || (settings === null || settings === void 0 ? void 0 : settings.index) === undefined || !parent.children.length || (settings === null || settings === void 0 ? void 0 : settings.index) >= parent.children.length) {
            parent.appendChild(cardElement);
        }
        else {
            parent.insertBefore(cardElement, parent.children[settings.index]);
        }
    };
    CardStock.prototype.moveFromOtherStock = function (card, cardElement, animation, settings) {
        var promise;
        var element = animation.fromStock.contains(card) ? this.manager.getCardElement(card) : animation.fromStock.element;
        var fromRect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
        this.addCardElementToParent(cardElement, settings);
        this.removeSelectionClassesFromElement(cardElement);
        promise = fromRect ? this.animationFromElement(cardElement, fromRect, {
            originalSide: animation.originalSide,
            rotationDelta: animation.rotationDelta,
            animation: animation.animation,
        }) : Promise.resolve(false);
        // in the case the card was move inside the same stock we don't remove it
        if (animation.fromStock && animation.fromStock != this) {
            animation.fromStock.removeCard(card);
        }
        if (!promise) {
            console.warn("CardStock.moveFromOtherStock didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    CardStock.prototype.moveFromElement = function (card, cardElement, animation, settings) {
        var promise;
        this.addCardElementToParent(cardElement, settings);
        if (animation) {
            if (animation.fromStock) {
                promise = this.animationFromElement(cardElement, animation.fromStock.element.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
                animation.fromStock.removeCard(card);
            }
            else if (animation.fromElement) {
                promise = this.animationFromElement(cardElement, animation.fromElement.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
            }
        }
        else {
            promise = Promise.resolve(false);
        }
        if (!promise) {
            console.warn("CardStock.moveFromElement didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    /**
     * Add an array of cards to the stock.
     *
     * @param cards the cards to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @param shift if number, the number of milliseconds between each card. if true, chain animations
     */
    CardStock.prototype.addCards = function (cards, animation, settings, shift) {
        if (shift === void 0) { shift = false; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, result, others, _loop_2, i, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.manager.animationsActive()) {
                            shift = false;
                        }
                        promises = [];
                        if (!(shift === true)) return [3 /*break*/, 4];
                        if (!cards.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addCard(cards[0], animation, settings)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.addCards(cards.slice(1), animation, settings, shift)];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, result || others];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        if (typeof shift === 'number') {
                            _loop_2 = function (i) {
                                promises.push(new Promise(function (resolve) {
                                    setTimeout(function () { return _this.addCard(cards[i], animation, settings).then(function (result) { return resolve(result); }); }, i * shift);
                                }));
                            };
                            for (i = 0; i < cards.length; i++) {
                                _loop_2(i);
                            }
                        }
                        else {
                            promises = cards.map(function (card) { return _this.addCard(card, animation, settings); });
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, Promise.all(promises)];
                    case 6:
                        results = _a.sent();
                        return [2 /*return*/, results.some(function (result) { return result; })];
                }
            });
        });
    };
    /**
     * Remove a card from the stock.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeCard = function (card, settings) {
        var promise;
        if (this.contains(card) && this.element.contains(this.getCardElement(card))) {
            promise = this.manager.removeCard(card, settings);
        }
        else {
            promise = Promise.resolve(false);
        }
        this.cardRemoved(card, settings);
        return promise;
    };
    /**
     * Notify the stock that a card is removed.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.cardRemoved = function (card, settings) {
        var _this = this;
        var index = this.cards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
        if (this.selectedCards.find(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); })) {
            this.unselectCard(card);
        }
    };
    /**
     * Remove a set of card from the stock.
     *
     * @param cards the cards to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeCards = function (cards, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = cards.map(function (card) { return _this.removeCard(card, settings); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.some(function (result) { return result; })];
                }
            });
        });
    };
    /**
     * Remove all cards from the stock.
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeAll = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var cards;
            return __generator(this, function (_a) {
                cards = this.getCards();
                return [2 /*return*/, this.removeCards(cards, settings)];
            });
        });
    };
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected cards.
     *
     * @param selectionMode the selection mode
     * @param selectableCards the selectable cards (all if unset). Calls `setSelectableCards` method
     */
    CardStock.prototype.setSelectionMode = function (selectionMode, selectableCards) {
        var _this = this;
        if (selectionMode !== this.selectionMode) {
            this.unselectAll(true);
        }
        this.cards.forEach(function (card) { return _this.setSelectableCard(card, selectionMode != 'none'); });
        this.element.classList.toggle('bga-cards_selectable-stock', selectionMode != 'none');
        this.selectionMode = selectionMode;
        if (selectionMode === 'none') {
            this.getCards().forEach(function (card) { return _this.removeSelectionClasses(card); });
        }
        else {
            this.setSelectableCards(selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards());
        }
    };
    CardStock.prototype.setSelectableCard = function (card, selectable) {
        if (this.selectionMode === 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        if (selectableCardsClass) {
            element === null || element === void 0 ? void 0 : element.classList.toggle(selectableCardsClass, selectable);
        }
        if (unselectableCardsClass) {
            element === null || element === void 0 ? void 0 : element.classList.toggle(unselectableCardsClass, !selectable);
        }
        if (!selectable && this.isSelected(card)) {
            this.unselectCard(card, true);
        }
    };
    /**
     * Set the selectable class for each card.
     *
     * @param selectableCards the selectable cards. If unset, all cards are marked selectable. Default unset.
     */
    CardStock.prototype.setSelectableCards = function (selectableCards) {
        var _this = this;
        if (this.selectionMode === 'none') {
            return;
        }
        var selectableCardsIds = (selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards()).map(function (card) { return _this.manager.getId(card); });
        this.cards.forEach(function (card) {
            return _this.setSelectableCard(card, selectableCardsIds.includes(_this.manager.getId(card)));
        });
    };
    /**
     * Set selected state to a card.
     *
     * @param card the card to select
     */
    CardStock.prototype.selectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        if (!element || !element.classList.contains(selectableCardsClass)) {
            return;
        }
        if (this.selectionMode === 'single') {
            this.cards.filter(function (c) { return _this.manager.getId(c) != _this.manager.getId(card); }).forEach(function (c) { return _this.unselectCard(c, true); });
        }
        var selectedCardsClass = this.getSelectedCardClass();
        element.classList.add(selectedCardsClass);
        this.selectedCards.push(card);
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    /**
     * Set unselected state to a card.
     *
     * @param card the card to unselect
     */
    CardStock.prototype.unselectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var element = this.getCardElement(card);
        var selectedCardsClass = this.getSelectedCardClass();
        element === null || element === void 0 ? void 0 : element.classList.remove(selectedCardsClass);
        var index = this.selectedCards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.selectedCards.splice(index, 1);
        }
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    /**
     * Select all cards
     */
    CardStock.prototype.selectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        this.cards.forEach(function (c) { return _this.selectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    /**
     * Unelect all cards
     */
    CardStock.prototype.unselectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var cards = this.getCards(); // use a copy of the array as we iterate and modify it at the same time
        cards.forEach(function (c) { return _this.unselectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    CardStock.prototype.bindClick = function () {
        var _this = this;
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (event) {
            var cardDiv = event.target.closest('.card');
            if (!cardDiv) {
                return;
            }
            var card = _this.cards.find(function (c) { return _this.manager.getId(c) == cardDiv.id; });
            if (!card) {
                return;
            }
            _this.cardClick(card);
        });
    };
    CardStock.prototype.cardClick = function (card) {
        var _this = this;
        var _a;
        if (this.selectionMode != 'none') {
            var alreadySelected = this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
            if (alreadySelected) {
                this.unselectCard(card);
            }
            else {
                this.selectCard(card);
            }
        }
        (_a = this.onCardClick) === null || _a === void 0 ? void 0 : _a.call(this, card);
    };
    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts.
     * @param fromElement The HTMLElement to animate from.
     */
    CardStock.prototype.animationFromElement = function (element, fromRect, settings) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var side, cardSides_1, animation, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        side = element.dataset.side;
                        if (settings.originalSide && settings.originalSide != side) {
                            cardSides_1 = element.getElementsByClassName('card-sides')[0];
                            cardSides_1.style.transition = 'none';
                            element.dataset.side = settings.originalSide;
                            setTimeout(function () {
                                cardSides_1.style.transition = null;
                                element.dataset.side = side;
                            });
                        }
                        animation = settings.animation;
                        if (animation) {
                            animation.settings.element = element;
                            animation.settings.fromRect = fromRect;
                        }
                        else {
                            animation = new BgaSlideAnimation({ element: element, fromRect: fromRect });
                        }
                        return [4 /*yield*/, this.manager.animationManager.play(animation)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result.played) !== null && _a !== void 0 ? _a : false];
                }
            });
        });
    };
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     */
    CardStock.prototype.setCardVisible = function (card, visible, settings) {
        this.manager.setCardVisible(card, visible, settings);
    };
    /**
     * Flips the card.
     *
     * @param card the card informations
     */
    CardStock.prototype.flipCard = function (card, settings) {
        this.manager.flipCard(card, settings);
    };
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    CardStock.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? this.manager.getSelectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    CardStock.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? this.manager.getUnselectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    /**
     * @returns the class to apply to selected cards. Use class from manager is unset.
     */
    CardStock.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? this.manager.getSelectedCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    CardStock.prototype.removeSelectionClasses = function (card) {
        this.removeSelectionClassesFromElement(this.getCardElement(card));
    };
    CardStock.prototype.removeSelectionClassesFromElement = function (cardElement) {
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        var selectedCardsClass = this.getSelectedCardClass();
        cardElement === null || cardElement === void 0 ? void 0 : cardElement.classList.remove(selectableCardsClass, unselectableCardsClass, selectedCardsClass);
    };
    return CardStock;
}());
var HandStock = /** @class */ (function (_super) {
    __extends(HandStock, _super);
    function HandStock(manager, element, settings) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('hand-stock');
        element.style.setProperty('--card-overlap', (_a = settings.cardOverlap) !== null && _a !== void 0 ? _a : '60px');
        element.style.setProperty('--card-shift', (_b = settings.cardShift) !== null && _b !== void 0 ? _b : '15px');
        element.style.setProperty('--card-inclination', "".concat((_c = settings.inclination) !== null && _c !== void 0 ? _c : 12, "deg"));
        _this.inclination = (_d = settings.inclination) !== null && _d !== void 0 ? _d : 4;
        return _this;
    }
    HandStock.prototype.addCard = function (card, animation, settings) {
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        this.updateAngles();
        return promise;
    };
    HandStock.prototype.cardRemoved = function (card, settings) {
        _super.prototype.cardRemoved.call(this, card, settings);
        this.updateAngles();
    };
    HandStock.prototype.updateAngles = function () {
        var _this = this;
        var middle = (this.cards.length - 1) / 2;
        this.cards.forEach(function (card, index) {
            var middleIndex = index - middle;
            var cardElement = _this.getCardElement(card);
            cardElement.style.setProperty('--hand-stock-middle-index', "".concat(middleIndex));
            cardElement.style.setProperty('--hand-stock-middle-index-abs', "".concat(Math.abs(middleIndex)));
        });
    };
    return HandStock;
}(CardStock));
var SlideAndBackAnimation = /** @class */ (function (_super) {
    __extends(SlideAndBackAnimation, _super);
    function SlideAndBackAnimation(manager, element, tempElement) {
        var distance = (manager.getCardWidth() + manager.getCardHeight()) / 2;
        var angle = Math.random() * Math.PI * 2;
        var fromDelta = {
            x: distance * Math.cos(angle),
            y: distance * Math.sin(angle),
        };
        return _super.call(this, {
            animations: [
                new BgaSlideToAnimation({ element: element, fromDelta: fromDelta, duration: 250 }),
                new BgaSlideAnimation({ element: element, fromDelta: fromDelta, duration: 250, animationEnd: tempElement ? (function () { return element.remove(); }) : undefined }),
            ]
        }) || this;
    }
    return SlideAndBackAnimation;
}(BgaCumulatedAnimation));
/**
 * Abstract stock to represent a deck. (pile of cards, with a fake 3d effect of thickness). *
 * Needs cardWidth and cardHeight to be set in the card manager.
 */
var Deck = /** @class */ (function (_super) {
    __extends(Deck, _super);
    function Deck(manager, element, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('deck');
        var cardWidth = _this.manager.getCardWidth();
        var cardHeight = _this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            _this.element.style.setProperty('--width', "".concat(cardWidth, "px"));
            _this.element.style.setProperty('--height', "".concat(cardHeight, "px"));
        }
        else {
            throw new Error("You need to set cardWidth and cardHeight in the card manager to use Deck.");
        }
        _this.fakeCardGenerator = (_a = settings === null || settings === void 0 ? void 0 : settings.fakeCardGenerator) !== null && _a !== void 0 ? _a : manager.getFakeCardGenerator();
        _this.thicknesses = (_b = settings.thicknesses) !== null && _b !== void 0 ? _b : [0, 2, 5, 10, 20, 30];
        _this.setCardNumber((_c = settings.cardNumber) !== null && _c !== void 0 ? _c : 0);
        _this.autoUpdateCardNumber = (_d = settings.autoUpdateCardNumber) !== null && _d !== void 0 ? _d : true;
        _this.autoRemovePreviousCards = (_e = settings.autoRemovePreviousCards) !== null && _e !== void 0 ? _e : true;
        var shadowDirection = (_f = settings.shadowDirection) !== null && _f !== void 0 ? _f : 'bottom-right';
        var shadowDirectionSplit = shadowDirection.split('-');
        var xShadowShift = shadowDirectionSplit.includes('right') ? 1 : (shadowDirectionSplit.includes('left') ? -1 : 0);
        var yShadowShift = shadowDirectionSplit.includes('bottom') ? 1 : (shadowDirectionSplit.includes('top') ? -1 : 0);
        _this.element.style.setProperty('--xShadowShift', '' + xShadowShift);
        _this.element.style.setProperty('--yShadowShift', '' + yShadowShift);
        if (settings.topCard) {
            _this.addCard(settings.topCard);
        }
        else if (settings.cardNumber > 0) {
            _this.addCard(_this.getFakeCard());
        }
        if (settings.counter && ((_g = settings.counter.show) !== null && _g !== void 0 ? _g : true)) {
            if (settings.cardNumber === null || settings.cardNumber === undefined) {
                console.warn("Deck card counter created without a cardNumber");
            }
            _this.createCounter((_h = settings.counter.position) !== null && _h !== void 0 ? _h : 'bottom', (_j = settings.counter.extraClasses) !== null && _j !== void 0 ? _j : 'round', settings.counter.counterId);
            if ((_k = settings.counter) === null || _k === void 0 ? void 0 : _k.hideWhenEmpty) {
                _this.element.querySelector('.bga-cards_deck-counter').classList.add('hide-when-empty');
            }
        }
        _this.setCardNumber((_l = settings.cardNumber) !== null && _l !== void 0 ? _l : 0);
        return _this;
    }
    Deck.prototype.createCounter = function (counterPosition, extraClasses, counterId) {
        var left = counterPosition.includes('right') ? 100 : (counterPosition.includes('left') ? 0 : 50);
        var top = counterPosition.includes('bottom') ? 100 : (counterPosition.includes('top') ? 0 : 50);
        this.element.style.setProperty('--bga-cards-deck-left', "".concat(left, "%"));
        this.element.style.setProperty('--bga-cards-deck-top', "".concat(top, "%"));
        this.element.insertAdjacentHTML('beforeend', "\n            <div ".concat(counterId ? "id=\"".concat(counterId, "\"") : '', " class=\"bga-cards_deck-counter ").concat(extraClasses, "\"></div>\n        "));
    };
    /**
     * Get the the cards number.
     *
     * @returns the cards number
     */
    Deck.prototype.getCardNumber = function () {
        return this.cardNumber;
    };
    /**
     * Set the the cards number.
     *
     * @param cardNumber the cards number
     * @param topCard the deck top card. If unset, will generated a fake card (default). Set it to null to not generate a new topCard.
     */
    Deck.prototype.setCardNumber = function (cardNumber, topCard) {
        var _this = this;
        if (topCard === void 0) { topCard = undefined; }
        var promise = Promise.resolve(false);
        var oldTopCard = this.getTopCard();
        if (topCard !== null && cardNumber > 0) {
            var newTopCard = topCard || this.getFakeCard();
            if (!oldTopCard || this.manager.getId(newTopCard) != this.manager.getId(oldTopCard)) {
                promise = this.addCard(newTopCard, undefined, { autoUpdateCardNumber: false });
            }
        }
        else if (cardNumber == 0 && oldTopCard) {
            promise = this.removeCard(oldTopCard, { autoUpdateCardNumber: false });
        }
        this.cardNumber = cardNumber;
        this.element.dataset.empty = (this.cardNumber == 0).toString();
        var thickness = 0;
        this.thicknesses.forEach(function (threshold, index) {
            if (_this.cardNumber >= threshold) {
                thickness = index;
            }
        });
        this.element.style.setProperty('--thickness', "".concat(thickness, "px"));
        var counterDiv = this.element.querySelector('.bga-cards_deck-counter');
        if (counterDiv) {
            counterDiv.innerHTML = "".concat(cardNumber);
        }
        return promise;
    };
    Deck.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber + 1, null);
        }
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        if ((_b = settings === null || settings === void 0 ? void 0 : settings.autoRemovePreviousCards) !== null && _b !== void 0 ? _b : this.autoRemovePreviousCards) {
            promise.then(function () {
                var previousCards = _this.getCards().slice(0, -1); // remove last cards
                _this.removeCards(previousCards, { autoUpdateCardNumber: false });
            });
        }
        return promise;
    };
    Deck.prototype.cardRemoved = function (card, settings) {
        var _a;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber - 1);
        }
        _super.prototype.cardRemoved.call(this, card, settings);
    };
    Deck.prototype.removeAll = function (settings) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_c) {
                promise = _super.prototype.removeAll.call(this, __assign(__assign({}, settings), { autoUpdateCardNumber: (_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : false }));
                if ((_b = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _b !== void 0 ? _b : true) {
                    this.setCardNumber(0, null);
                }
                return [2 /*return*/, promise];
            });
        });
    };
    Deck.prototype.getTopCard = function () {
        var cards = this.getCards();
        return cards.length ? cards[cards.length - 1] : null;
    };
    /**
     * Shows a shuffle animation on the deck
     *
     * @param animatedCardsMax number of animated cards for shuffle animation.
     * @param fakeCardSetter a function to generate a fake card for animation. Required if the card id is not based on a numerci `id` field, or if you want to set custom card back
     * @returns promise when animation ends
     */
    Deck.prototype.shuffle = function (settings) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var animatedCardsMax, animatedCards, elements, getFakeCard, uid, i, newCard, newElement, pauseDelayAfterAnimation;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        animatedCardsMax = (_a = settings === null || settings === void 0 ? void 0 : settings.animatedCardsMax) !== null && _a !== void 0 ? _a : 10;
                        this.addCard((_b = settings === null || settings === void 0 ? void 0 : settings.newTopCard) !== null && _b !== void 0 ? _b : this.getFakeCard(), undefined, { autoUpdateCardNumber: false });
                        if (!this.manager.animationsActive()) {
                            return [2 /*return*/, Promise.resolve(false)]; // we don't execute as it's just visual temporary stuff
                        }
                        animatedCards = Math.min(10, animatedCardsMax, this.getCardNumber());
                        if (!(animatedCards > 1)) return [3 /*break*/, 4];
                        elements = [this.getCardElement(this.getTopCard())];
                        getFakeCard = function (uid) {
                            var newCard;
                            if (settings === null || settings === void 0 ? void 0 : settings.fakeCardSetter) {
                                newCard = {};
                                settings === null || settings === void 0 ? void 0 : settings.fakeCardSetter(newCard, uid);
                            }
                            else {
                                newCard = _this.fakeCardGenerator("".concat(_this.element.id, "-shuffle-").concat(uid));
                            }
                            return newCard;
                        };
                        uid = 0;
                        for (i = elements.length; i <= animatedCards; i++) {
                            newCard = void 0;
                            do {
                                newCard = getFakeCard(uid++);
                            } while (this.manager.getCardElement(newCard)); // To make sure there isn't a fake card remaining with the same uid
                            newElement = this.manager.createCardElement(newCard, false);
                            newElement.dataset.tempCardForShuffleAnimation = 'true';
                            this.element.prepend(newElement);
                            elements.push(newElement);
                        }
                        return [4 /*yield*/, this.manager.animationManager.playWithDelay(elements.map(function (element) { return new SlideAndBackAnimation(_this.manager, element, element.dataset.tempCardForShuffleAnimation == 'true'); }), 50)];
                    case 1:
                        _d.sent();
                        pauseDelayAfterAnimation = (_c = settings === null || settings === void 0 ? void 0 : settings.pauseDelayAfterAnimation) !== null && _c !== void 0 ? _c : 500;
                        if (!(pauseDelayAfterAnimation > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.manager.animationManager.play(new BgaPauseAnimation({ duration: pauseDelayAfterAnimation }))];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3: return [2 /*return*/, true];
                    case 4: return [2 /*return*/, Promise.resolve(false)];
                }
            });
        });
    };
    Deck.prototype.getFakeCard = function () {
        return this.fakeCardGenerator(this.element.id);
    };
    return Deck;
}(CardStock));
/**
 * A basic stock for a list of cards, based on flex.
 */
var LineStock = /** @class */ (function (_super) {
    __extends(LineStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    function LineStock(manager, element, settings) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('line-stock');
        element.dataset.center = ((_a = settings === null || settings === void 0 ? void 0 : settings.center) !== null && _a !== void 0 ? _a : true).toString();
        element.style.setProperty('--wrap', (_b = settings === null || settings === void 0 ? void 0 : settings.wrap) !== null && _b !== void 0 ? _b : 'wrap');
        element.style.setProperty('--direction', (_c = settings === null || settings === void 0 ? void 0 : settings.direction) !== null && _c !== void 0 ? _c : 'row');
        element.style.setProperty('--gap', (_d = settings === null || settings === void 0 ? void 0 : settings.gap) !== null && _d !== void 0 ? _d : '8px');
        return _this;
    }
    return LineStock;
}(CardStock));
/**
 * A stock with fixed slots (some can be empty)
 */
var SlotStock = /** @class */ (function (_super) {
    __extends(SlotStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    function SlotStock(manager, element, settings) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        _this.slotsIds = [];
        _this.slots = [];
        element.classList.add('slot-stock');
        _this.mapCardToSlot = settings.mapCardToSlot;
        _this.slotsIds = (_a = settings.slotsIds) !== null && _a !== void 0 ? _a : [];
        _this.slotClasses = (_b = settings.slotClasses) !== null && _b !== void 0 ? _b : [];
        _this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
        return _this;
    }
    SlotStock.prototype.createSlot = function (slotId) {
        var _a;
        this.slots[slotId] = document.createElement("div");
        this.slots[slotId].dataset.slotId = slotId;
        this.element.appendChild(this.slots[slotId]);
        (_a = this.slots[slotId].classList).add.apply(_a, __spreadArray(['slot'], this.slotClasses, true));
    };
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    SlotStock.prototype.addCard = function (card, animation, settings) {
        var _a, _b;
        var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapCardToSlot) === null || _b === void 0 ? void 0 : _b.call(this, card);
        if (slotId === undefined) {
            throw new Error("Impossible to add card to slot : no SlotId. Add slotId to settings or set mapCardToSlot to SlotCard constructor.");
        }
        if (!this.slots[slotId]) {
            throw new Error("Impossible to add card to slot \"".concat(slotId, "\" : slot \"").concat(slotId, "\" doesn't exists."));
        }
        var newSettings = __assign(__assign({}, settings), { forceToElement: this.slots[slotId] });
        return _super.prototype.addCard.call(this, card, animation, newSettings);
    };
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    SlotStock.prototype.setSlotsIds = function (slotsIds) {
        var _this = this;
        if (slotsIds.length == this.slotsIds.length && slotsIds.every(function (slotId, index) { return _this.slotsIds[index] === slotId; })) {
            // no change
            return;
        }
        this.removeAll();
        this.element.innerHTML = '';
        this.slotsIds = slotsIds !== null && slotsIds !== void 0 ? slotsIds : [];
        this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
    };
    /**
     * Add new slots ids. Will not change nor empty the existing ones.
     *
     * @param slotsIds the new slotsIds. Will be merged with the old ones.
     */
    SlotStock.prototype.addSlotsIds = function (newSlotsIds) {
        var _a;
        var _this = this;
        if (newSlotsIds.length == 0) {
            // no change
            return;
        }
        (_a = this.slotsIds).push.apply(_a, newSlotsIds);
        newSlotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
    };
    SlotStock.prototype.canAddCard = function (card, settings) {
        var _a, _b;
        if (!this.contains(card)) {
            return true;
        }
        else {
            var closestSlot = this.getCardElement(card).closest('.slot');
            if (closestSlot) {
                var currentCardSlot = closestSlot.dataset.slotId;
                var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapCardToSlot) === null || _b === void 0 ? void 0 : _b.call(this, card);
                return currentCardSlot != slotId;
            }
            else {
                return true;
            }
        }
    };
    /**
     * Swap cards inside the slot stock.
     *
     * @param cards the cards to swap
     * @param settings for `updateInformations` and `selectable`
     */
    SlotStock.prototype.swapCards = function (cards, settings) {
        var _this = this;
        if (!this.mapCardToSlot) {
            throw new Error('You need to define SlotStock.mapCardToSlot to use SlotStock.swapCards');
        }
        var promises = [];
        var elements = cards.map(function (card) { return _this.manager.getCardElement(card); });
        var elementsRects = elements.map(function (element) { return element.getBoundingClientRect(); });
        var cssPositions = elements.map(function (element) { return element.style.position; });
        // we set to absolute so it doesn't mess with slide coordinates when 2 div are at the same place
        elements.forEach(function (element) { return element.style.position = 'absolute'; });
        cards.forEach(function (card, index) {
            var _a, _b;
            var cardElement = elements[index];
            var promise;
            var slotId = (_a = _this.mapCardToSlot) === null || _a === void 0 ? void 0 : _a.call(_this, card);
            _this.slots[slotId].appendChild(cardElement);
            cardElement.style.position = cssPositions[index];
            var cardIndex = _this.cards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
            if (cardIndex !== -1) {
                _this.cards.splice(cardIndex, 1, card);
            }
            if ((_b = settings === null || settings === void 0 ? void 0 : settings.updateInformations) !== null && _b !== void 0 ? _b : true) { // after splice/push
                _this.manager.updateCardInformations(card);
            }
            _this.removeSelectionClassesFromElement(cardElement);
            promise = _this.animationFromElement(cardElement, elementsRects[index], {});
            if (!promise) {
                console.warn("CardStock.animationFromElement didn't return a Promise");
                promise = Promise.resolve(false);
            }
            promise.then(function () { var _a; return _this.setSelectableCard(card, (_a = settings === null || settings === void 0 ? void 0 : settings.selectable) !== null && _a !== void 0 ? _a : true); });
            promises.push(promise);
        });
        return Promise.all(promises);
    };
    return SlotStock;
}(LineStock));
/**
 * A stock to make cards disappear (to automatically remove discarded cards, or to represent a bag)
 */
var VoidStock = /** @class */ (function (_super) {
    __extends(VoidStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function VoidStock(manager, element) {
        var _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('void-stock');
        return _this;
    }
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToVoidStockSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    VoidStock.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a;
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        // center the element
        var cardElement = this.getCardElement(card);
        var originalLeft = cardElement.style.left;
        var originalTop = cardElement.style.top;
        cardElement.style.left = "".concat((this.element.clientWidth - cardElement.clientWidth) / 2, "px");
        cardElement.style.top = "".concat((this.element.clientHeight - cardElement.clientHeight) / 2, "px");
        if (!promise) {
            console.warn("VoidStock.addCard didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.remove) !== null && _a !== void 0 ? _a : true) {
            return promise.then(function () {
                return _this.removeCard(card);
            });
        }
        else {
            cardElement.style.left = originalLeft;
            cardElement.style.top = originalTop;
            return promise;
        }
    };
    return VoidStock;
}(CardStock));
var CardManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `CardManagerSettings` object
     */
    function CardManager(game, settings) {
        var _a;
        this.game = game;
        this.settings = settings;
        this.stocks = [];
        this.updateMainTimeoutId = [];
        this.updateFrontTimeoutId = [];
        this.updateBackTimeoutId = [];
        this.animationManager = (_a = settings.animationManager) !== null && _a !== void 0 ? _a : new AnimationManager(game);
    }
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    CardManager.prototype.animationsActive = function () {
        return this.animationManager.animationsActive();
    };
    CardManager.prototype.addStock = function (stock) {
        this.stocks.push(stock);
    };
    CardManager.prototype.removeStock = function (stock) {
        var index = this.stocks.indexOf(stock);
        if (index !== -1) {
            this.stocks.splice(index, 1);
        }
    };
    /**
     * @param card the card informations
     * @return the id for a card
     */
    CardManager.prototype.getId = function (card) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.settings).getId) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : "card-".concat(card.id);
    };
    CardManager.prototype.createCardElement = function (card, visible) {
        var _a, _b, _c, _d, _e, _f;
        if (visible === void 0) { visible = true; }
        var id = this.getId(card);
        var side = visible ? 'front' : 'back';
        if (this.getCardElement(card)) {
            throw new Error('This card already exists ' + JSON.stringify(card));
        }
        var element = document.createElement("div");
        element.id = id;
        element.dataset.side = '' + side;
        element.innerHTML = "\n            <div class=\"card-sides\">\n                <div id=\"".concat(id, "-front\" class=\"card-side front\">\n                </div>\n                <div id=\"").concat(id, "-back\" class=\"card-side back\">\n                </div>\n            </div>\n        ");
        element.classList.add('card');
        document.body.appendChild(element);
        (_b = (_a = this.settings).setupDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element);
        (_d = (_c = this.settings).setupFrontDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element.getElementsByClassName('front')[0]);
        (_f = (_e = this.settings).setupBackDiv) === null || _f === void 0 ? void 0 : _f.call(_e, card, element.getElementsByClassName('back')[0]);
        document.body.removeChild(element);
        return element;
    };
    /**
     * @param card the card informations
     * @return the HTML element of an existing card
     */
    CardManager.prototype.getCardElement = function (card) {
        return document.getElementById(this.getId(card));
    };
    /**
     * Remove a card.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardManager.prototype.removeCard = function (card, settings) {
        var _a;
        var id = this.getId(card);
        var div = document.getElementById(id);
        if (!div) {
            return Promise.resolve(false);
        }
        div.id = "deleted".concat(id);
        div.remove();
        // if the card is in a stock, notify the stock about removal
        (_a = this.getCardStock(card)) === null || _a === void 0 ? void 0 : _a.cardRemoved(card, settings);
        return Promise.resolve(true);
    };
    /**
     * Returns the stock containing the card.
     *
     * @param card the card informations
     * @return the stock containing the card
     */
    CardManager.prototype.getCardStock = function (card) {
        return this.stocks.find(function (stock) { return stock.contains(card); });
    };
    /**
     * Return if the card passed as parameter is suppose to be visible or not.
     * Use `isCardVisible` from settings if set, else will check if `card.type` is defined
     *
     * @param card the card informations
     * @return the visiblility of the card (true means front side should be displayed)
     */
    CardManager.prototype.isCardVisible = function (card) {
        var _a, _b, _c, _d;
        return (_c = (_b = (_a = this.settings).isCardVisible) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : ((_d = card.type) !== null && _d !== void 0 ? _d : false);
    };
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     * @param visible if the card is set to visible face. If unset, will use isCardVisible(card)
     * @param settings the flip params (to update the card in current stock)
     */
    CardManager.prototype.setCardVisible = function (card, visible, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var element = this.getCardElement(card);
        if (!element) {
            return;
        }
        var isVisible = visible !== null && visible !== void 0 ? visible : this.isCardVisible(card);
        element.dataset.side = isVisible ? 'front' : 'back';
        var stringId = JSON.stringify(this.getId(card));
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.updateMain) !== null && _a !== void 0 ? _a : false) {
            if (this.updateMainTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateMainTimeoutId[stringId]);
                delete this.updateMainTimeoutId[stringId];
            }
            var updateMainDelay = (_b = settings === null || settings === void 0 ? void 0 : settings.updateMainDelay) !== null && _b !== void 0 ? _b : 0;
            if (isVisible && updateMainDelay > 0 && this.animationsActive()) {
                this.updateMainTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element); }, updateMainDelay);
            }
            else {
                (_d = (_c = this.settings).setupDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element);
            }
        }
        if ((_e = settings === null || settings === void 0 ? void 0 : settings.updateFront) !== null && _e !== void 0 ? _e : true) {
            if (this.updateFrontTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateFrontTimeoutId[stringId]);
                delete this.updateFrontTimeoutId[stringId];
            }
            var updateFrontDelay = (_f = settings === null || settings === void 0 ? void 0 : settings.updateFrontDelay) !== null && _f !== void 0 ? _f : 500;
            if (!isVisible && updateFrontDelay > 0 && this.animationsActive()) {
                this.updateFrontTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupFrontDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('front')[0]); }, updateFrontDelay);
            }
            else {
                (_h = (_g = this.settings).setupFrontDiv) === null || _h === void 0 ? void 0 : _h.call(_g, card, element.getElementsByClassName('front')[0]);
            }
        }
        if ((_j = settings === null || settings === void 0 ? void 0 : settings.updateBack) !== null && _j !== void 0 ? _j : false) {
            if (this.updateBackTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateBackTimeoutId[stringId]);
                delete this.updateBackTimeoutId[stringId];
            }
            var updateBackDelay = (_k = settings === null || settings === void 0 ? void 0 : settings.updateBackDelay) !== null && _k !== void 0 ? _k : 0;
            if (isVisible && updateBackDelay > 0 && this.animationsActive()) {
                this.updateBackTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupBackDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('back')[0]); }, updateBackDelay);
            }
            else {
                (_m = (_l = this.settings).setupBackDiv) === null || _m === void 0 ? void 0 : _m.call(_l, card, element.getElementsByClassName('back')[0]);
            }
        }
        if ((_o = settings === null || settings === void 0 ? void 0 : settings.updateData) !== null && _o !== void 0 ? _o : true) {
            // card data has changed
            var stock = this.getCardStock(card);
            var cards = stock.getCards();
            var cardIndex = cards.findIndex(function (c) { return _this.getId(c) === _this.getId(card); });
            if (cardIndex !== -1) {
                stock.cards.splice(cardIndex, 1, card);
            }
        }
    };
    /**
     * Flips the card.
     *
     * @param card the card informations
     * @param settings the flip params (to update the card in current stock)
     */
    CardManager.prototype.flipCard = function (card, settings) {
        var element = this.getCardElement(card);
        var currentlyVisible = element.dataset.side === 'front';
        this.setCardVisible(card, !currentlyVisible, settings);
    };
    /**
     * Update the card informations. Used when a card with just an id (back shown) should be revealed, with all data needed to populate the front.
     *
     * @param card the card informations
     */
    CardManager.prototype.updateCardInformations = function (card, settings) {
        var newSettings = __assign(__assign({}, (settings !== null && settings !== void 0 ? settings : {})), { updateData: true });
        this.setCardVisible(card, undefined, newSettings);
    };
    /**
     * @returns the card with set in the settings (undefined if unset)
     */
    CardManager.prototype.getCardWidth = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardWidth;
    };
    /**
     * @returns the card height set in the settings (undefined if unset)
     */
    CardManager.prototype.getCardHeight = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardHeight;
    };
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_selectable-card'.
     */
    CardManager.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? 'bga-cards_selectable-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_disabled-card'.
     */
    CardManager.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? 'bga-cards_disabled-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    /**
     * @returns the class to apply to selected cards. Default 'bga-cards_selected-card'.
     */
    CardManager.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? 'bga-cards_selected-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    CardManager.prototype.getFakeCardGenerator = function () {
        var _this = this;
        var _a, _b;
        return (_b = (_a = this.settings) === null || _a === void 0 ? void 0 : _a.fakeCardGenerator) !== null && _b !== void 0 ? _b : (function (deckId) { return ({ id: _this.getId({ id: "".concat(deckId, "-fake-top-card") }) }); });
    };
    return CardManager;
}());
function sortFunction() {
    var sortedFields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sortedFields[_i] = arguments[_i];
    }
    return function (a, b) {
        for (var i = 0; i < sortedFields.length; i++) {
            var direction = 1;
            var field = sortedFields[i];
            if (field[0] == '-') {
                direction = -1;
                field = field.substring(1);
            }
            else if (field[0] == '+') {
                field = field.substring(1);
            }
            var type = typeof a[field];
            if (type === 'string') {
                var compare = a[field].localeCompare(b[field]);
                if (compare !== 0) {
                    return compare;
                }
            }
            else if (type === 'number') {
                var compare = (a[field] - b[field]) * direction;
                if (compare !== 0) {
                    return compare * direction;
                }
            }
        }
        return 0;
    };
}
define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "".concat(g_gamethemeurl, "modules/js/libs/bga-dice.js"),
    getLibUrl("bga-autofit", "1.x"),
], function (dojo, declare, counter, gamegui, dice, BgaAutoFit) {
    window.BgaAutoFit = BgaAutoFit;
    return declare("bgagame.wanderingtowers", ebg.core.gamegui, new WanderingTowers());
});
var Card = /** @class */ (function () {
    function Card(game, card) {
        this.game = game;
        this.id = Number(card.id);
        this.location = card.location;
        this.location_arg = Number(card.location_arg);
        this.type = card.type;
        this.type_arg = Number(card.type_arg);
        this.card = {
            id: this.id,
            location: this.location,
            location_arg: this.location_arg,
            type: this.type,
            type_arg: this.type_arg,
        };
    }
    return Card;
}());
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
        if (settings === void 0) { settings = { borderRadius: 12 }; }
        return _super.call(this, settings) || this;
    }
    Die.prototype.setupDieDiv = function (die, element) {
        _super.prototype.setupDieDiv.call(this, die, element);
        element.classList.add("wtw_die");
    };
    return Die;
}(BgaDie6));
var Move = /** @class */ (function (_super) {
    __extends(Move, _super);
    function Move(game, card) {
        var _this = _super.call(this, game, card) || this;
        _this.stocks = _this.game.wtw.stocks.moves;
        _this.player_id =
            _this.card.location === "hand" ? _this.card.location_arg : null;
        var isCurrentPlayer = _this.player_id == _this.game.player_id;
        _this.hand = isCurrentPlayer ? _this.stocks.hand : null;
        _this.void =
            _this.card.location === "hand" && !isCurrentPlayer
                ? _this.stocks[_this.player_id].hand
                : null;
        return _this;
    }
    Move.prototype.setup = function () {
        if (this.location === "hand") {
            this.hand.addCard(this.card, {}, { visible: true });
            this.hand.setCardVisible(this.card, true);
            return;
        }
        this.stocks.deck.addCard(this.card, {}, { visible: false });
        this.stocks.deck.setCardVisible(this.card, false);
    };
    Move.prototype.setupDiv = function (element) {
        element.classList.add("wtw_card", "wtw_move");
    };
    Move.prototype.setupFrontDiv = function (element) {
        if (!this.type_arg) {
            return;
        }
        element.classList.add("wtw_move-front");
        var spritePos = this.type_arg - 1;
        if (spritePos >= 10) {
            element.style.backgroundImage = "url(\"".concat(g_gamethemeurl, "img/moves_2.png\")");
            spritePos -= 10;
        }
        element.style.backgroundPosition = "".concat(spritePos * -100, "%");
        var tooltipElement = element.parentElement.parentElement.cloneNode(true);
        tooltipElement.removeAttribute("id");
        tooltipElement.querySelectorAll("[id]").forEach(function (childElement) {
            childElement.removeAttribute("id");
        });
        tooltipElement.classList.add("wtw_move-tooltip");
        this.game.addTooltipHtml(element.id, tooltipElement.outerHTML);
    };
    Move.prototype.setupBackDiv = function (element) {
        element.classList.add("wtw_move-back");
    };
    Move.prototype.toggleSelection = function (enabled) {
        this.hand.toggleSelection(enabled);
        if (enabled) {
            this.select(true);
        }
    };
    Move.prototype.select = function (silent) {
        if (silent === void 0) { silent = false; }
        this.hand.selectCard(this.card, silent);
    };
    Move.prototype.toggleSelectedClass = function (force) {
        this.hand
            .getCardElement(this.card)
            .classList.toggle("wtw_move-selected", force);
    };
    Move.prototype.discard = function (player_id) {
        var fromElement = player_id != this.game.player_id
            ? this.game.getPlayerPanelElement(player_id)
            : undefined;
        this.stocks.discard.addCard(this.card, {
            fromElement: fromElement,
        }, {});
    };
    Move.prototype.draw = function (priv) {
        if (priv) {
            this.hand.addCard(this.card, { fromStock: this.stocks.deck }, { visible: true });
            return;
        }
        this.void.addCard(this.card, { fromStock: this.stocks.deck });
        this.void.setCardVisible(this.card, false);
    };
    return Move;
}(Card));
var MoveHandStock = /** @class */ (function (_super) {
    __extends(MoveHandStock, _super);
    function MoveHandStock(game, manager) {
        var _this = _super.call(this, manager, document.getElementById("wtw_moveHand"), {
            cardOverlap: "0",
        }) || this;
        _this.game = game;
        _this.setSelectionMode("none");
        return _this;
    }
    MoveHandStock.prototype.setup = function (cards) {
        var _this = this;
        cards.forEach(function (card) {
            var move = new Move(_this.game, card);
            move.setup();
        });
    };
    MoveHandStock.prototype.toggleSelection = function (enable) {
        var selectionMode = enable ? "single" : "none";
        this.setSelectionMode(selectionMode);
    };
    return MoveHandStock;
}(HandStock));
var Potion = /** @class */ (function (_super) {
    __extends(Potion, _super);
    function Potion(game, card) {
        var _this = _super.call(this, game, card) || this;
        _this.player_id = _this.card.location_arg;
        _this.cargo = _this.game.wtw.stocks.potions[_this.player_id].cargo;
        return _this;
    }
    Potion.prototype.setup = function () {
        this.cargo.addCard(this.card, {});
        this.cargo.setCardVisible(this.card, this.card.location === "empty");
    };
    Potion.prototype.setupDiv = function (element) {
        element.classList.add("wtw_card", "wtw_potion");
    };
    Potion.prototype.setupFrontDiv = function (element) {
        if (!this.card.type_arg) {
            return;
        }
        element.classList.add("wtw_potion-empty");
        element.style.backgroundPosition = "".concat(Number(this.card.type) * -100, "%");
    };
    Potion.prototype.setupBackDiv = function (element) {
        element.classList.add("wtw_potion-filled");
        element.style.backgroundPosition = "".concat(Number(this.card.type) * -100, "%");
    };
    Potion.prototype.fill = function () {
        this.cargo.setCardVisible(this.card, false);
    };
    return Potion;
}(Card));
var PotionCargoStock = /** @class */ (function (_super) {
    __extends(PotionCargoStock, _super);
    function PotionCargoStock(game, manager, player_id) {
        var _this = _super.call(this, manager, document.getElementById("wtw_potionCargo-".concat(player_id))) || this;
        _this.game = game;
        _this.setSelectionMode("none");
        return _this;
    }
    PotionCargoStock.prototype.setup = function (cards) {
        var _this = this;
        cards.forEach(function (card) {
            var potion = new Potion(_this.game, card);
            potion.setup();
        });
    };
    return PotionCargoStock;
}(LineStock));
var Space = /** @class */ (function () {
    function Space(game, space_id) {
        this.game = game;
        this.space_id = space_id;
        var wtw = this.game.wtw;
        this.towerStock = wtw.stocks.towers.spaces[this.space_id];
        this.tierCounter = wtw.counters.spaces[this.space_id];
    }
    Space.prototype.updateTier = function () {
        var tier = this.towerStock.getCards().length;
        this.tierCounter.toValue(tier);
    };
    Space.prototype.getMaxTier = function () {
        var towerCards = this.towerStock.getCards();
        var maxTier = towerCards.length;
        return maxTier;
    };
    Space.prototype.getMinTier = function (excludeRavenskeep) {
        var _this = this;
        if (excludeRavenskeep === void 0) { excludeRavenskeep = true; }
        var towerCards = this.towerStock.getCards();
        var minTier = 1;
        if (excludeRavenskeep) {
            var hasRavenskeep = towerCards.some(function (towerCard) {
                var tower = new Tower(_this.game, towerCard);
                return tower.isRavenskeep;
            });
            if (hasRavenskeep) {
                minTier = 2;
            }
        }
        return minTier;
    };
    return Space;
}());
var Spell = /** @class */ (function (_super) {
    __extends(Spell, _super);
    function Spell(game, card) {
        var _this = _super.call(this, game, card) || this;
        _this.table = _this.game.wtw.stocks.spells.table;
        _this.id = _this.card.type_arg;
        var info = _this.game.wtw.material.spells[_this.id];
        _this.description = info.description;
        _this.name = info.name;
        return _this;
    }
    Spell.prototype.setup = function () {
        this.table.addCard(this.card);
        if (this.card.location !== "table") {
            this.table.setCardVisible(this.card, false);
        }
    };
    Spell.prototype.setupDiv = function (element) {
        element.classList.add("wtw_card", "wtw_spell");
    };
    Spell.prototype.setupFrontDiv = function (element) {
        element.style.backgroundPosition = "".concat(this.card.type_arg * -100, "%");
        if (this.card.type_arg === 7) {
            element.style.backgroundPosition = "-800%";
        }
        var tooltipHTML = this.createTooltip(element.parentElement.parentElement);
        this.game.addTooltipHtml(element.id, tooltipHTML);
    };
    Spell.prototype.createTooltip = function (element) {
        if (!element) {
            element = document.getElementById("wtw_spell-".concat(this.id));
        }
        var cloneElement = element.cloneNode(true);
        cloneElement.removeAttribute("id");
        cloneElement.querySelectorAll("[id]").forEach(function (childElement) {
            childElement.removeAttribute("id");
        });
        cloneElement.classList.add("wtw_spell-tooltip");
        var tooltipHTML = "\n      <div class=\"wtw_spellTooltip\">\n      <h4 class=\"wtw_tooltipText wtw_tooltipTitle\">".concat(this.name, "</h4>\n      <div class=\"wtw_spellContent\">\n          ").concat(cloneElement.outerHTML, "\n          <p class=\"bga-autofit wtw_tooltipText wtw_spellDescription\">").concat(this.description, "</p>\n        </div>\n      </div>\n    ");
        return tooltipHTML;
    };
    Spell.prototype.toggleSelection = function (enabled) {
        var _this = this;
        this.table.setSelectionMode(enabled ? "single" : "none");
        if (enabled) {
            this.select(true);
            this.table.onSelectionChange = function () {
                _this.game.restoreServerGameState();
            };
        }
    };
    Spell.prototype.select = function (silent) {
        if (silent === void 0) { silent = false; }
        this.table.selectCard(this.card, silent);
    };
    Spell.prototype.discard = function () {
        this.table.setCardVisible(this.card, false);
    };
    return Spell;
}(Card));
var Tower = /** @class */ (function (_super) {
    __extends(Tower, _super);
    function Tower(game, card) {
        var _this = _super.call(this, game, card) || this;
        _this.card.tier = Number(card.tier);
        _this.stocks = _this.game.wtw.stocks.towers;
        _this.space_id = _this.card.location_arg;
        _this.isRavenskeep = _this.card.type === "ravenskeep";
        return _this;
    }
    Tower.prototype.setup = function () {
        this.place(this.location_arg);
    };
    Tower.prototype.setupDiv = function (element) {
        element.classList.add("wtw_card", "wtw_tower");
        if (this.isRavenskeep) {
            element.classList.add("wtw_tower-ravenskeep");
        }
        if (this.card.type === "raven") {
            element.classList.add("wtw_tower-raven");
        }
    };
    Tower.prototype.toggleSelection = function (enabled) {
        this.stocks.spaces[this.space_id].toggleSelection(enabled);
        if (enabled) {
            this.select(true);
        }
    };
    Tower.prototype.select = function (silent) {
        if (silent === void 0) { silent = false; }
        this.stocks.spaces[this.space_id].selectCard(this.card, silent);
    };
    Tower.prototype.place = function (space_id) {
        this.space_id = space_id;
        var stock = this.stocks.spaces[space_id];
        stock.addCard(this.card, {}, { visible: true });
    };
    Tower.prototype.move = function (space_id, current_space_id) {
        this.place(space_id);
        var prevSpace = new Space(this.game, current_space_id);
        prevSpace.updateTier();
        var nextSpace = new Space(this.game, space_id);
        nextSpace.updateTier();
    };
    return Tower;
}(Card));
var TowerSpaceStock = /** @class */ (function (_super) {
    __extends(TowerSpaceStock, _super);
    function TowerSpaceStock(game, manager, space_id) {
        var _this = _super.call(this, manager, document.getElementById("wtw_spaceTowers-".concat(space_id)), {
            sort: sortFunction("-tier"),
        }) || this;
        _this.game = game;
        _this.space_id = space_id;
        _this.setSelectionMode("none");
        return _this;
    }
    TowerSpaceStock.prototype.unselectOthers = function () {
        var otherStocks = this.game.wtw.stocks.towers.spaces;
        for (var space_id in otherStocks) {
            if (Number(space_id) === this.space_id) {
                continue;
            }
            otherStocks[space_id].unselectAll(true);
        }
    };
    TowerSpaceStock.prototype.toggleSelection = function (enable) {
        var selectionMode = enable ? "single" : "none";
        this.setSelectionMode(selectionMode);
    };
    return TowerSpaceStock;
}(CardStock));
var Wizard = /** @class */ (function (_super) {
    __extends(Wizard, _super);
    function Wizard(game, card) {
        var _this = _super.call(this, game, card) || this;
        _this.space_id = _this.card.location_arg;
        _this.card.tier = Number(card.tier);
        _this.stocks = _this.game.wtw.stocks.wizards;
        _this.towerTier =
            _this.game.wtw.stocks.towers.spaces[_this.space_id].getCards().length;
        _this.tier = _this.card.tier;
        return _this;
    }
    Wizard.prototype.setup = function () {
        this.place(this.space_id);
    };
    Wizard.prototype.setupDiv = function (element) {
        element.classList.add("wtw_card", "wtw_wizard");
        var backgroundPosition = "".concat(Number(this.card.type) * -100, "%");
        element.style.backgroundPosition = backgroundPosition;
        var player_id = this.card.type_arg;
        var tooltip = player_id === this.game.player_id
            ? _("Your wizard")
            : _("${player_name}'s wizard");
        var tooltipText = this.game.format_string_recursive(_(tooltip), {
            player_id: player_id,
            player_name: this.game.gamedatas.players[player_id].name,
        });
        this.game.addTooltipHtml(element.id, "\n      <div class=\"wtw_wizardTooltip\">\n        <div class=\"wtw_card wtw_wizard wtw_wizard-tooltip\" style=\"background-position: ".concat(backgroundPosition, "\"></div>\n        <span class=\"wtw_tooltipText\">").concat(tooltipText, "</span>\n      </div>\n      "));
        var panelWizard = document.getElementById("wtw_panelWizard-".concat(player_id));
        if (!panelWizard.style.backgroundPosition) {
            panelWizard.style.backgroundPosition = backgroundPosition;
        }
    };
    Wizard.prototype.place = function (space_id) {
        this.stocks.spaces[space_id][this.tier].addCard(this.card, {}, { visible: true });
    };
    Wizard.prototype.move = function (space_id) {
        this.place(space_id);
    };
    Wizard.prototype.enterRavenskeep = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stock, cardElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stock = this.stocks.spaces[this.space_id][this.tier];
                        cardElement = stock.getCardElement(this.card);
                        cardElement.classList.add("wtw_wizard-ravenskeep");
                        return [4 /*yield*/, this.game.wait(1000)];
                    case 1:
                        _a.sent();
                        cardElement.remove();
                        stock.cardRemoved(this.card);
                        return [2 /*return*/];
                }
            });
        });
    };
    Wizard.prototype.free = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stocks.spaces[this.space_id][this.tier].addCard(this.card)];
            });
        });
    };
    return Wizard;
}(Card));
var WizardSpaceStock = /** @class */ (function (_super) {
    __extends(WizardSpaceStock, _super);
    function WizardSpaceStock(game, manager, space_id, tier) {
        var _this = _super.call(this, manager, document.getElementById("wtw_wizardTier-".concat(space_id, "-").concat(tier)), {}) || this;
        _this.game = game;
        _this.space_id = space_id;
        _this.setSelectionMode("none");
        return _this;
    }
    WizardSpaceStock.prototype.unselectOthers = function () {
        var _this = this;
        this.game.loopWizardStocks(function (stock, space_id, tier) {
            if (Number(space_id) === _this.space_id) {
                return;
            }
            stock.unselectAll(true);
        });
    };
    WizardSpaceStock.prototype.toggleSelection = function (enable) {
        var selectionMode = enable ? "single" : "none";
        this.setSelectionMode(selectionMode);
    };
    WizardSpaceStock.prototype.getPlayerWizards = function (player_id) {
        return this.getCards().filter(function (card) {
            return card.type_arg === player_id;
        });
    };
    return WizardSpaceStock;
}(CardStock));
var NotificationManager = /** @class */ (function () {
    function NotificationManager(game) {
        this.game = game;
        this.stocks = this.game.wtw.stocks;
    }
    NotificationManager.prototype.notif_moveWizard = function (args) {
        var wizardCard = args.wizardCard, space_id = args.space_id;
        var wizard = new Wizard(this.game, wizardCard);
        wizard.move(space_id);
    };
    NotificationManager.prototype.notif_moveTower = function (args) {
        var _this = this;
        var cards = args.cards, final_space_id = args.final_space_id, current_space_id = args.current_space_id;
        cards.forEach(function (card) {
            var tower = new Tower(_this.game, card);
            tower.move(final_space_id, current_space_id);
        });
    };
    NotificationManager.prototype.notif_discardMove = function (args) {
        var card = args.card, player_id = args.player_id;
        var move = new Move(this.game, card);
        move.discard(player_id);
    };
    NotificationManager.prototype.notif_drawMove = function (args) {
        var _this = this;
        var cards = args.cards, player_id = args.player_id;
        if (this.game.player_id == player_id) {
            return;
        }
        cards.forEach(function (card) {
            var move = new Move(_this.game, card);
            move.draw(false);
        });
    };
    NotificationManager.prototype.notif_drawMovePriv = function (args) {
        var _this = this;
        var cards = args.cards;
        cards.forEach(function (card) {
            var move = new Move(_this.game, card);
            move.draw(true);
        });
    };
    NotificationManager.prototype.notif_rollDie = function (args) {
        var face = args.face;
        this.stocks.dice.rollDie({ id: 1, type: "die", face: face });
    };
    NotificationManager.prototype.notif_fillPotion = function (args) {
        var potionCard = args.potionCard;
        var potion = new Potion(this.game, potionCard);
        potion.fill();
        this.game.soundPlay("pour");
    };
    NotificationManager.prototype.notif_usePotions = function (args) {
        var nbr = args.nbr, player_id = args.player_id;
        var cargo = this.stocks.potions[player_id].cargo;
        var voidStock = this.stocks.potions.void;
        var potionCards = cargo.getCards().slice(0, nbr);
        voidStock.addCards(potionCards);
        this.game.soundPlay("drink");
    };
    NotificationManager.prototype.notif_enterRavenskeep = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var wizardCard, player_id, wizard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wizardCard = args.wizardCard, player_id = args.player_id;
                        wizard = new Wizard(this.game, wizardCard);
                        return [4 /*yield*/, wizard.enterRavenskeep()];
                    case 1:
                        _a.sent();
                        this.game.wtw.counters[player_id].ravenskeep.incValue(1);
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationManager.prototype.notif_autoreshuffle = function (args) {
        var _a = this.stocks.moves, discard = _a.discard, deck = _a.deck;
        deck.addCards(discard.getCards());
        deck.shuffle({ animatedCardsMax: 5 });
    };
    NotificationManager.prototype.notif_incScore = function (args) {
        var score = args.score, player_id = args.player_id;
        this.game.scoreCtrl[player_id].incValue(score);
    };
    NotificationManager.prototype.notif_swapTower = function (args) {
        var towerCard = args.towerCard, final_space_id = args.final_space_id, current_space_id = args.current_space_id;
        var tower = new Tower(this.game, towerCard);
        tower.move(final_space_id, current_space_id);
    };
    NotificationManager.prototype.notif_freeWizard = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var wizardCard, towerCard, towerElement, wizard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wizardCard = args.wizardCard, towerCard = args.towerCard;
                        towerElement = document.getElementById("wtw_tower-".concat(towerCard.id));
                        towerElement.classList.add("wtw_tower-elevated");
                        towerElement.dataset.elevated = "1";
                        wizard = new Wizard(this.game, wizardCard);
                        return [4 /*yield*/, this.game.wait(500)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, wizard.free()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.game.wait(1000)];
                    case 3:
                        _a.sent();
                        towerElement.dataset.elevated = "-1";
                        return [4 /*yield*/, this.game.wait(1500)];
                    case 4:
                        _a.sent();
                        towerElement.removeAttribute("data-elevated");
                        towerElement.classList.remove("wtw_tower-elevated");
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationManager.prototype.notif_failFreeWizard = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var towerCard, towerElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        towerCard = args.towerCard;
                        towerElement = document.getElementById("wtw_tower-".concat(towerCard.id));
                        towerElement.classList.add("wtw_tower-elevated");
                        towerElement.setAttribute("data-elevated", "1");
                        return [4 /*yield*/, this.game.wait(3000)];
                    case 1:
                        _a.sent();
                        towerElement.removeAttribute("data-elevated");
                        towerElement.classList.remove("wtw_tower-elevated");
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationManager.prototype.notif_discardSpells = function (args) {
        var _this = this;
        var spellCards = args.spellCards;
        spellCards.forEach(function (spellCard) {
            var spell = new Spell(_this.game, spellCard);
            spell.discard();
        });
    };
    return NotificationManager;
}());
var StateManager = /** @class */ (function () {
    function StateManager(game, stateName) {
        this.game = game;
        this.stateName = stateName;
        this.statusBar = this.game.statusBar;
        this.wtw = this.game.wtw;
    }
    StateManager.prototype.enter = function (args) {
        var _this = this;
        if (this.stateName.includes("client_")) {
            this.game.statusBar.addActionButton(_("cancel"), function () {
                _this.game.restoreServerGameState();
            }, { color: "alert" });
        }
    };
    StateManager.prototype.leave = function () { };
    return StateManager;
}());
var StCastSpell = /** @class */ (function (_super) {
    __extends(StCastSpell, _super);
    function StCastSpell(game) {
        return _super.call(this, game, "client_castSpell") || this;
    }
    StCastSpell.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick a spell"),
        });
    };
    StCastSpell.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var spellTable = this.wtw.stocks.spells.table;
        spellTable.setSelectionMode("single");
        spellTable.setSelectableCards(args.castableSpells);
        spellTable.onSelectionChange = function (selection, spellCard) {
            var _a;
            (_a = document.getElementById("wtw_spellBtn")) === null || _a === void 0 ? void 0 : _a.remove();
            if (selection.length > 0) {
                var spell = new Spell(_this.game, spellCard);
                _this.statusBar.addActionButton(_this.game.format_string_recursive(_("cast ${spell_label}"), {
                    spell_label: _(spell.name),
                }), function () {
                    _this.wtw.globals.spellCard = spellCard;
                    switch (spellCard.type) {
                        case "wizard":
                            var stPickSpellWizard = new StPickSpellWizard(_this.game);
                            stPickSpellWizard.set();
                            break;
                        case "tower":
                            var stPickSpellTower = new StPickSpellTower(_this.game);
                            stPickSpellTower.set();
                            break;
                        case "direction":
                            var stPickSpellDirection = new StPickSpellDirection(_this.game);
                            stPickSpellDirection.set();
                    }
                }, {
                    id: "wtw_spellBtn",
                });
                return;
            }
        };
    };
    StCastSpell.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var spellTable = this.wtw.stocks.spells.table;
        spellTable.setSelectionMode("none");
    };
    return StCastSpell;
}(StateManager));
var StPickMoveSide = /** @class */ (function (_super) {
    __extends(StPickMoveSide, _super);
    function StPickMoveSide(game) {
        return _super.call(this, game, "client_pickMoveSide") || this;
    }
    StPickMoveSide.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick whether to move a wizard or a tower"),
        });
    };
    StPickMoveSide.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var moveCard = this.game.wtw.globals.moveCard;
        var move = new Move(this.game, moveCard);
        move.toggleSelection(true);
        var movableMeeples = args._private.movableMeeples;
        var _a = movableMeeples[moveCard.id], movableTowers = _a.tower, movableWizards = _a.wizard;
        this.statusBar.addActionButton(_("tower"), function () {
            var stPickMoveTower = new StPickMoveTower(_this.game);
            stPickMoveTower.set();
        }, { disabled: movableTowers.length === 0 });
        this.statusBar.addActionButton(_("wizard"), function () {
            var stPickMoveWizard = new StPickMoveWizard(_this.game);
            stPickMoveWizard.set();
        }, {
            disabled: movableWizards.length === 0,
        });
    };
    StPickMoveSide.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var moveCard = this.game.wtw.globals.moveCard;
        var move = new Move(this.game, moveCard);
        move.toggleSelection(false);
    };
    return StPickMoveSide;
}(StateManager));
var StPickMoveTier = /** @class */ (function (_super) {
    __extends(StPickMoveTier, _super);
    function StPickMoveTier(game) {
        return _super.call(this, game, "client_pickMoveTier") || this;
    }
    StPickMoveTier.prototype.set = function () {
        var _a = this.game.wtw.globals, _b = _a.action, action = _b === void 0 ? "actMoveTower" : _b, moveCard = _a.moveCard, towerCard = _a.towerCard, maxTier = _a.maxTier, minTier = _a.minTier;
        if (maxTier === minTier) {
            var moveCard_id = action === "actMoveTower" ? moveCard.id : undefined;
            var tower = new Tower(this.game, towerCard);
            this.game.performAction(action, {
                moveCard_id: moveCard_id,
                space_id: tower.space_id,
                tier: maxTier - 1 || 1,
            });
            return;
        }
        this.game.setClientState("client_pickMoveTier", {
            descriptionmyturn: _("${you} must pick the number of tiers to move"),
        });
    };
    StPickMoveTier.prototype.enter = function () {
        var _this = this;
        _super.prototype.enter.call(this);
        var _a = this.game.wtw.globals, moveCard = _a.moveCard, towerCard = _a.towerCard, maxTier = _a.maxTier, minTier = _a.minTier, _b = _a.action, action = _b === void 0 ? "actMoveTower" : _b;
        var tower = new Tower(this.game, towerCard);
        tower.toggleSelection(true);
        var moveCard_id = action === "actMoveTower" ? moveCard.id : undefined;
        if (action === "actMoveTower") {
            var move = new Move(this.game, moveCard);
            move.toggleSelection(true);
        }
        var _loop_3 = function (i) {
            this_1.game.statusBar.addActionButton("".concat(i), function () {
                _this.game.performAction(action, {
                    moveCard_id: moveCard_id,
                    space_id: tower.space_id,
                    tier: maxTier - i + 1,
                });
            }, {});
        };
        var this_1 = this;
        for (var i = minTier; i <= maxTier; i++) {
            _loop_3(i);
        }
    };
    StPickMoveTier.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var _a = this.game.wtw.globals, moveCard = _a.moveCard, towerCard = _a.towerCard;
        if (moveCard) {
            var move = new Move(this.game, moveCard);
            move.toggleSelection(false);
        }
        var tower = new Tower(this.game, towerCard);
        tower.toggleSelection(false);
    };
    return StPickMoveTier;
}(StateManager));
var StPickMoveTower = /** @class */ (function (_super) {
    __extends(StPickMoveTower, _super);
    function StPickMoveTower(game) {
        return _super.call(this, game, "client_pickMoveTower") || this;
    }
    StPickMoveTower.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick a tower to move"),
        });
    };
    StPickMoveTower.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var movableMeeples = args._private.movableMeeples;
        var card = this.game.wtw.globals.moveCard;
        var move = new Move(this.game, card);
        move.toggleSelection(true);
        var towerStocks = this.game.wtw.stocks.towers.spaces;
        var _loop_4 = function (space_id) {
            var stock = towerStocks[space_id];
            stock.toggleSelection(true);
            stock.setSelectableCards(movableMeeples[move.card.id].tower);
            stock.onSelectionChange = function (selection, towerCard) {
                _this.game.removeConfirmationButton();
                if (selection.length > 0) {
                    stock.unselectOthers();
                    var tower = new Tower(_this.game, towerCard);
                    var space = new Space(_this.game, tower.space_id);
                    var maxTier = space.getMaxTier();
                    var minTier = space.getMinTier();
                    _this.game.wtw.globals.towerCard = tower.card;
                    _this.game.wtw.globals.maxTier = maxTier;
                    _this.game.wtw.globals.minTier = minTier;
                    if (maxTier > minTier) {
                        var stPickMoveTier = new StPickMoveTier(_this.game);
                        stPickMoveTier.set();
                        return;
                    }
                    _this.game.addConfirmationButton(_("tower"), function () {
                        var stPickMoveTier = new StPickMoveTier(_this.game);
                        stPickMoveTier.set();
                    });
                    return;
                }
                _this.game.restoreServerGameState();
            };
        };
        for (var space_id in towerStocks) {
            _loop_4(space_id);
        }
    };
    StPickMoveTower.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var moveCard = this.game.wtw.globals.moveCard;
        var move = new Move(this.game, moveCard);
        move.toggleSelection(false);
        var towerStocks = this.game.wtw.stocks.towers.spaces;
        for (var space_id in towerStocks) {
            var stock = towerStocks[space_id];
            stock.toggleSelection(false);
        }
    };
    return StPickMoveTower;
}(StateManager));
var StPickMoveWizard = /** @class */ (function (_super) {
    __extends(StPickMoveWizard, _super);
    function StPickMoveWizard(game) {
        return _super.call(this, game, "client_pickMoveWizard") || this;
    }
    StPickMoveWizard.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick a wizard to move"),
        });
    };
    StPickMoveWizard.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var movableMeeples = args._private.movableMeeples;
        var moveCard = this.game.wtw.globals.moveCard;
        var move = new Move(this.game, moveCard);
        move.toggleSelection(true);
        this.game.loopWizardStocks(function (stock) {
            stock.toggleSelection(true);
            stock.setSelectableCards(movableMeeples[move.card.id].wizard);
            stock.onSelectionChange = function (selection, towerCard) {
                _this.game.removeConfirmationButton();
                if (selection.length > 0) {
                    stock.unselectOthers();
                    _this.game.addConfirmationButton(_("wizard"), function () {
                        _this.game.performAction("actMoveWizard", {
                            moveCard_id: move.card.id,
                            wizardCard_id: towerCard.id,
                        });
                    });
                }
            };
        });
    };
    StPickMoveWizard.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var card = this.game.wtw.globals.moveCard;
        var move = new Move(this.game, card);
        move.toggleSelection(false);
        this.game.loopWizardStocks(function (stock) {
            stock.toggleSelection(false);
        });
    };
    return StPickMoveWizard;
}(StateManager));
var StPickPushTower = /** @class */ (function (_super) {
    __extends(StPickPushTower, _super);
    function StPickPushTower(game) {
        return _super.call(this, game, "client_pickPushTower") || this;
    }
    StPickPushTower.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick a tower to push 1 space"),
        });
    };
    StPickPushTower.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var pushableTowers = args.pushableTowers;
        var towerStocks = this.game.wtw.stocks.towers.spaces;
        var _loop_5 = function (space_id) {
            var stock = towerStocks[space_id];
            stock.toggleSelection(true);
            stock.setSelectableCards(pushableTowers);
            stock.onSelectionChange = function (selection, card) {
                _this.game.removeConfirmationButton();
                if (selection.length > 0) {
                    stock.unselectOthers();
                    var tower = new Tower(_this.game, card);
                    var space = new Space(_this.game, tower.space_id);
                    var maxTier = space.getMaxTier();
                    var minTier = space.getMinTier();
                    _this.game.wtw.globals.towerCard = tower.card;
                    _this.game.wtw.globals.maxTier = maxTier;
                    _this.game.wtw.globals.minTier = minTier;
                    _this.game.wtw.globals.action = "actPushTower";
                    if (maxTier > minTier) {
                        var stPickMoveTier = new StPickMoveTier(_this.game);
                        stPickMoveTier.set();
                        return;
                    }
                    _this.game.addConfirmationButton(_("tower"), function () {
                        var stPickMoveTier = new StPickMoveTier(_this.game);
                        stPickMoveTier.set();
                    });
                    return;
                }
                _this.game.restoreServerGameState();
            };
        };
        for (var space_id in towerStocks) {
            _loop_5(space_id);
        }
    };
    StPickPushTower.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var towerStocks = this.game.wtw.stocks.towers.spaces;
        for (var space_id in towerStocks) {
            var stock = towerStocks[space_id];
            stock.toggleSelection(false);
        }
    };
    return StPickPushTower;
}(StateManager));
var StPickSpellDirection = /** @class */ (function (_super) {
    __extends(StPickSpellDirection, _super);
    function StPickSpellDirection(game) {
        return _super.call(this, game, "client_pickSpellDirection") || this;
    }
    StPickSpellDirection.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick the direction of the spell"),
        });
    };
    StPickSpellDirection.prototype.enter = function () {
        var _this = this;
        _super.prototype.enter.call(this);
        var spellCard = this.game.wtw.globals.spellCard;
        var spell = new Spell(this.game, spellCard);
        spell.toggleSelection(true);
        this.statusBar.addActionButton(_("clockwise"), function () {
            _this.game.performAction("actCastSpell", {
                spell_id: spell.id,
                direction: "clockwise",
            });
        }, {});
        this.statusBar.addActionButton(_("counterclockwise"), function () {
            _this.game.performAction("actCastSpell", {
                spell_id: spell.id,
                direction: "counterclockwise",
            });
        }, {});
    };
    StPickSpellDirection.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var spellCard = this.game.wtw.globals.spellCard;
        var spell = new Spell(this.game, spellCard);
        spell.toggleSelection(false);
    };
    return StPickSpellDirection;
}(StateManager));
var StPickSpellTier = /** @class */ (function (_super) {
    __extends(StPickSpellTier, _super);
    function StPickSpellTier(game) {
        return _super.call(this, game, "client_pickSpellTier") || this;
    }
    StPickSpellTier.prototype.set = function () {
        var _a = this.game.wtw.globals, spellCard = _a.spellCard, towerCard = _a.towerCard, maxTier = _a.maxTier, minTier = _a.minTier;
        if (maxTier === minTier) {
            var tower = new Tower(this.game, towerCard);
            var spell = new Spell(this.game, spellCard);
            this.game.performAction("actCastSpell", {
                spell_id: spell.id,
                meeple_id: tower.space_id,
                tier: maxTier - 1 || 1,
            });
            return;
        }
        this.game.setClientState("client_pickSpellTier", {
            descriptionmyturn: _("${you} must pick the number of tiers for the spell"),
        });
    };
    StPickSpellTier.prototype.enter = function () {
        var _this = this;
        _super.prototype.enter.call(this);
        var _a = this.game.wtw.globals, spellCard = _a.spellCard, towerCard = _a.towerCard, maxTier = _a.maxTier, minTier = _a.minTier;
        var spell = new Spell(this.game, spellCard);
        spell.toggleSelection(true);
        var tower = new Tower(this.game, towerCard);
        tower.toggleSelection(true);
        var _loop_6 = function (i) {
            this_2.game.statusBar.addActionButton("".concat(i), function () {
                _this.game.performAction("actCastSpell", {
                    spell_id: spell.id,
                    meeple_id: tower.space_id,
                    tier: maxTier - i + 1,
                });
            }, {});
        };
        var this_2 = this;
        for (var i = minTier; i <= maxTier; i++) {
            _loop_6(i);
        }
    };
    StPickSpellTier.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var _a = this.game.wtw.globals, spellCard = _a.spellCard, towerCard = _a.towerCard;
        var spell = new Spell(this.game, spellCard);
        spell.toggleSelection(false);
        var tower = new Tower(this.game, towerCard);
        tower.toggleSelection(false);
    };
    return StPickSpellTier;
}(StateManager));
var StPickSpellTower = /** @class */ (function (_super) {
    __extends(StPickSpellTower, _super);
    function StPickSpellTower(game) {
        return _super.call(this, game, "client_pickSpellTower") || this;
    }
    StPickSpellTower.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick a tower for the spell"),
        });
    };
    StPickSpellTower.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var spellCard = this.wtw.globals.spellCard;
        var spell = new Spell(this.game, spellCard);
        spell.toggleSelection(true);
        var selectableTowers = args.spellableMeeples[spell.id].tower;
        var towerStocks = this.game.wtw.stocks.towers.spaces;
        var _loop_7 = function (space_id) {
            var stock = towerStocks[space_id];
            stock.toggleSelection(true);
            stock.setSelectableCards(selectableTowers);
            stock.onSelectionChange = function (selection, towerCard) {
                _this.game.removeConfirmationButton();
                if (selection.length > 0) {
                    stock.unselectOthers();
                    var tower = new Tower(_this.game, towerCard);
                    var space = new Space(_this.game, tower.space_id);
                    var maxTier = space.getMaxTier();
                    var minTier = space.getMinTier(spell.id !== 7);
                    _this.game.wtw.globals.towerCard = tower.card;
                    _this.game.wtw.globals.maxTier = maxTier;
                    _this.game.wtw.globals.minTier = minTier;
                    if (maxTier > minTier) {
                        var stPickSpellTier = new StPickSpellTier(_this.game);
                        stPickSpellTier.set();
                        return;
                    }
                    _this.game.addConfirmationButton(_("tower"), function () {
                        var stPickSpellTier = new StPickSpellTier(_this.game);
                        stPickSpellTier.set();
                    });
                }
            };
        };
        for (var space_id in towerStocks) {
            _loop_7(space_id);
        }
    };
    StPickSpellTower.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var spellTable = this.wtw.stocks.spells.table;
        spellTable.setSelectionMode("none");
        var towerStocks = this.game.wtw.stocks.towers.spaces;
        for (var space_id in towerStocks) {
            var stock = towerStocks[space_id];
            stock.toggleSelection(false);
        }
    };
    return StPickSpellTower;
}(StateManager));
var StPickSpellWizard = /** @class */ (function (_super) {
    __extends(StPickSpellWizard, _super);
    function StPickSpellWizard(game) {
        return _super.call(this, game, "client_pickSpellWizard") || this;
    }
    StPickSpellWizard.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick a wizard"),
        });
    };
    StPickSpellWizard.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var spellCard = this.wtw.globals.spellCard;
        var spell = new Spell(this.game, spellCard);
        spell.toggleSelection(true);
        var selectableWizards = args.spellableMeeples[spell.id].wizard;
        this.game.loopWizardStocks(function (stock) {
            stock.toggleSelection(true);
            stock.setSelectableCards(selectableWizards);
            stock.onSelectionChange = function (selection, wizardCard) {
                _this.game.removeConfirmationButton();
                if (selection.length > 0) {
                    stock.unselectOthers();
                    _this.game.addConfirmationButton(_("wizard"), function () {
                        _this.game.performAction("actCastSpell", {
                            spell_id: spell.id,
                            meeple_id: wizardCard.id,
                        });
                    });
                }
            };
        });
    };
    StPickSpellWizard.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var spellTable = this.wtw.stocks.spells.table;
        spellTable.setSelectionMode("none");
        this.game.loopWizardStocks(function (stock) {
            stock.toggleSelection(false);
        });
    };
    return StPickSpellWizard;
}(StateManager));
var StPlayMove = /** @class */ (function (_super) {
    __extends(StPlayMove, _super);
    function StPlayMove(game) {
        return _super.call(this, game, "client_playMove") || this;
    }
    StPlayMove.prototype.set = function () {
        this.game.setClientState(this.stateName, {
            descriptionmyturn: _("${you} must pick a movement card"),
        });
    };
    StPlayMove.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        var playableMoves = args._private.playableMoves;
        var moveHand = this.wtw.stocks.moves.hand;
        moveHand.toggleSelection(true);
        moveHand.setSelectableCards(playableMoves);
        moveHand.onSelectionChange = function (selection, card) {
            _this.game.removeConfirmationButton();
            if (selection.length > 0) {
                _this.game.wtw.globals.moveCard = card;
                var move_1 = new Move(_this.game, card);
                if (move_1.card.type_arg >= 19) {
                    _this.statusBar.setTitle(_("${you} must pick a movement card"));
                    _this.game.statusBar.removeActionButtons();
                    _this.game.statusBar.addActionButton(_("cancel"), function () {
                        _this.game.restoreServerGameState();
                    }, { color: "alert" });
                    _this.game.addConfirmationButton(_("move"), function () {
                        _this.game.performAction("actRollDice", {
                            moveCard_id: move_1.card.id,
                        });
                    });
                    return;
                }
                if (move_1.card.type === "both") {
                    var stPickMoveSide = new StPickMoveSide(_this.game);
                    stPickMoveSide.set();
                    return;
                }
                if (move_1.card.type === "tower") {
                    var stPickMoveTower = new StPickMoveTower(_this.game);
                    stPickMoveTower.set();
                    return;
                }
                if (move_1.card.type === "wizard") {
                    var stPickMoveWizard = new StPickMoveWizard(_this.game);
                    stPickMoveWizard.set();
                    return;
                }
                return;
            }
            _this.game.restoreServerGameState();
        };
    };
    StPlayMove.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var moveHand = this.wtw.stocks.moves.hand;
        moveHand.toggleSelection(false);
    };
    return StPlayMove;
}(StateManager));
var StAfterRoll = /** @class */ (function (_super) {
    __extends(StAfterRoll, _super);
    function StAfterRoll(game) {
        return _super.call(this, game, "afterRoll") || this;
    }
    StAfterRoll.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        this.game.wtw.globals = {};
        var moveCard = args.moveCard, _private = args._private;
        var movableMeeples = _private.movableMeeples;
        this.game.wtw.globals.moveCard = moveCard;
        var move = new Move(this.game, moveCard);
        move.toggleSelectedClass(true);
        if (move.card.type === "both") {
            this.statusBar.addActionButton(_("tower"), function () {
                var stPickMoveTower = new StPickMoveTower(_this.game);
                stPickMoveTower.set();
            }, {});
            this.statusBar.addActionButton(_("wizard"), function () {
                var stPickMoveWizard = new StPickMoveWizard(_this.game);
                stPickMoveWizard.set();
            }, {});
            return;
        }
        if (move.card.type === "tower") {
            var towerStocks = this.game.wtw.stocks.towers.spaces;
            var _loop_8 = function (space_id) {
                var stock = towerStocks[space_id];
                stock.toggleSelection(true);
                stock.setSelectableCards(movableMeeples[move.card.id].tower);
                stock.onSelectionChange = function (selection, card) {
                    _this.game.removeConfirmationButton();
                    if (selection.length > 0) {
                        stock.unselectOthers();
                        var tower = new Tower(_this.game, card);
                        var space = new Space(_this.game, tower.space_id);
                        var maxTier = space.getMaxTier();
                        var minTier = space.getMinTier();
                        _this.game.wtw.globals.towerCard = tower.card;
                        _this.game.wtw.globals.maxTier = maxTier;
                        _this.game.wtw.globals.minTier = minTier;
                        if (maxTier > minTier) {
                            var stPickMoveTier = new StPickMoveTier(_this.game);
                            stPickMoveTier.set();
                            return;
                        }
                        _this.game.addConfirmationButton(_("tower"), function () {
                            var stPickMoveTier = new StPickMoveTier(_this.game);
                            stPickMoveTier.set();
                        });
                        return;
                    }
                    _this.game.restoreServerGameState();
                };
            };
            for (var space_id in towerStocks) {
                _loop_8(space_id);
            }
            return;
        }
        if (move.card.type === "wizard") {
            this.game.loopWizardStocks(function (stock) {
                stock.toggleSelection(true);
                stock.setSelectableCards(movableMeeples[move.card.id].wizard);
                stock.onSelectionChange = function (selection, card) {
                    _this.game.removeConfirmationButton();
                    if (selection.length > 0) {
                        stock.unselectOthers();
                        _this.game.addConfirmationButton(_("wizard"), function () {
                            _this.game.performAction("actMoveWizard", {
                                moveCard_id: move.card.id,
                                wizardCard_id: card.id,
                            });
                        });
                    }
                };
            });
            return;
        }
    };
    StAfterRoll.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var moveCard = this.game.wtw.globals.moveCard;
        var move = new Move(this.game, moveCard);
        move.toggleSelectedClass(false);
        var towerStocks = this.game.wtw.stocks.towers.spaces;
        for (var space_id in towerStocks) {
            var stock = towerStocks[space_id];
            stock.toggleSelection(false);
        }
        var wizardStocks = this.game.wtw.stocks.wizards.spaces;
        this.game.loopWizardStocks(function (stock) {
            stock.toggleSelection(false);
        });
    };
    return StAfterRoll;
}(StateManager));
var StPlayerTurn = /** @class */ (function (_super) {
    __extends(StPlayerTurn, _super);
    function StPlayerTurn(game) {
        return _super.call(this, game, "playerTurn") || this;
    }
    StPlayerTurn.prototype.enter = function (args) {
        var _this = this;
        _super.prototype.enter.call(this);
        this.wtw.globals = {};
        var _private = args._private, pushableTowers = args.pushableTowers, castableSpells = args.castableSpells, canPass = args.canPass;
        var playableMoves = _private.playableMoves;
        if (playableMoves.length > 0) {
            this.statusBar.addActionButton(_("play movement"), function () {
                var stPlayMove = new StPlayMove(_this.game);
                stPlayMove.set();
            }, {});
        }
        if (castableSpells.length > 0) {
            this.statusBar.addActionButton(_("cast spell"), function () {
                var stCastSpell = new StCastSpell(_this.game);
                stCastSpell.set();
            }, {});
        }
        if (pushableTowers.length > 0) {
            this.statusBar.addActionButton(_("push a tower (discards hand)"), function () {
                var stPickPushTower = new StPickPushTower(_this.game);
                stPickPushTower.set();
            }, { classes: ["wtw_button", "wtw_button-brown"] });
        }
        if (canPass) {
            this.statusBar.setTitle(_("${you} may cast a spell or pass"));
            this.statusBar.addActionButton(_("pass"), function () {
                _this.game.performAction("actPass");
            }, {
                color: "alert",
            });
        }
    };
    StPlayerTurn.prototype.leave = function () {
        _super.prototype.leave.call(this);
    };
    return StPlayerTurn;
}(StateManager));
var StRerollDice = /** @class */ (function (_super) {
    __extends(StRerollDice, _super);
    function StRerollDice(game) {
        return _super.call(this, game, "rerollDice") || this;
    }
    StRerollDice.prototype.enter = function () {
        var _this = this;
        _super.prototype.enter.call(this);
        this.statusBar.addActionButton(_("Reroll"), function () {
            _this.game.performAction("actRerollDice");
        }, {});
        this.statusBar.addActionButton(_("Accept"), function () {
            _this.game.performAction("actAcceptRoll");
        }, { classes: ["wtw_positiveButton"] });
    };
    StRerollDice.prototype.leave = function () {
        _super.prototype.leave.call(this);
    };
    return StRerollDice;
}(StateManager));
var StSpellSelection = /** @class */ (function (_super) {
    __extends(StSpellSelection, _super);
    function StSpellSelection(game) {
        return _super.call(this, game, "spellSelection") || this;
    }
    StSpellSelection.prototype.enter = function () {
        var _this = this;
        _super.prototype.enter.call(this);
        var spellTable = this.wtw.stocks.spells.table;
        spellTable.setSelectionMode("multiple");
        spellTable.onSelectionChange = function (selection, spellCard) {
            if (selection.length > 3) {
                _this.game.showMessage(_("You can't pick more than 3 spells"), "error");
                var spellTable_1 = _this.wtw.stocks.spells.table;
                spellTable_1.unselectCard(spellCard, true);
                return;
            }
            _this.game.removeConfirmationButton();
            if (selection.length === 3) {
                var spell_ids_1 = selection.map(function (spellCard) {
                    var spell = new Spell(_this.game, spellCard);
                    return spell.id;
                });
                _this.game.addConfirmationButton(_("spells"), function () {
                    _this.game.performAction("actSelectSpells", {
                        spell_ids: spell_ids_1.join(","),
                    });
                });
                return;
            }
        };
    };
    StSpellSelection.prototype.leave = function () {
        _super.prototype.leave.call(this);
        var spellTable = this.wtw.stocks.spells.table;
        spellTable.setSelectionMode("none");
    };
    return StSpellSelection;
}(StateManager));
