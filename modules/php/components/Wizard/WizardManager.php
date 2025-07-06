<?php

namespace Bga\Games\WanderingTowers\Components\Wizard;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Move\Move;
use Bga\Games\WanderingTowers\Components\Potion\PotionManager;
use Bga\Games\WanderingTowers\Components\Spell\Spell;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class WizardManager extends CardManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game, $game->wizard_cards, "wizard");
        $this->fields .= ", tier";
    }

    public function setupCards(): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $playerNbr = count($players);

        $setupCounts = (array) $this->game->SETUP_COUNTS[$playerNbr];
        $wizardCount = (int) $setupCounts["wizards"];

        $gameinfos = $this->game->getGameinfos();
        $colors = $gameinfos["player_colors"];

        $wizardCards = [];
        foreach ($players as $player_id => $player) {
            $color = $player["player_color"];
            $k_color = array_search($color, $colors);
            $wizardCards[] = ["type" => $k_color, "type_arg" => $player_id, "nbr" => $wizardCount];
        }
        $this->createCards($wizardCards);

        foreach ($players as $player_id => $player) {
            $this->game->DbQuery("UPDATE wizard SET card_location='hand', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
        }

        $nextPlayerTable = (array) $this->game->getNextPlayerTable();
        $firstPlayer_id = (int) $nextPlayerTable[0];
        $this->setupOnTowers($firstPlayer_id);
    }

    public function setupOnTowers(int $player_id, int $space_id = 2): void
    {
        $space = (array) $this->game->SPACES[$space_id];
        $setupWizardCount = (int) $space["setupWizardCount"];

        if ($setupWizardCount === 0 || $this->countCardsInHand(null) === 0) {
            return;
        }

        if ($this->countCardsInHand($player_id) > 0) {
            if (
                $this->countOnSpace($space_id, 1) < $setupWizardCount
            ) {
                $this->transferCard("hand", "space", $player_id, $space_id);
                $player_id = $this->game->getPlayerAfter($player_id);
            } else {
                $space_id++;
            }
        } else {
            $player_id = $this->game->getPlayerAfter($player_id);
        }

        $this->setupOnTowers($player_id, $space_id);
    }

    public function countOnSpace(int $space_id, int $tier): int
    {
        $count = (int) $this->game->getUniqueValueFromDB("SELECT COUNT(card_id) FROM {$this->dbTable} WHERE card_location_arg={$space_id} AND tier={$tier}");
        return $count;
    }


    public function getByTier(int $space_id, int $tier): array
    {
        $cards = $this->getCardsInLocation("space", $space_id);

        $cards = array_filter(
            $cards,
            function ($card) use ($tier) {
                $card_id = (int) $card["id"];
                $Wizard = new Wizard($this->game, $card_id);
                return $tier === $Wizard->tier;
            }
        );

        return $cards;
    }

    public function moveWizardsWithTower(int $space_id, int $tier, int $towerCard_id): void
    {
        $wizardCards = $this->getByTier($space_id, $tier);

        foreach ($wizardCards as $wizardCard) {
            $wizardCard_id = (int) $wizardCard["id"];
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $Wizard->moveWithTower($towerCard_id);
        }
    }

    public function swapWizardsAlongTower(int $space_id, int $final_space_id, int $current_tier, int $final_tier): void
    {
        $wizardCards = $this->getByTier($space_id, $current_tier);

        foreach ($wizardCards as $wizardCard) {
            $wizardCard_id = (int) $wizardCard["id"];
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $Wizard->swapAlongTower($final_space_id, $final_tier);
        }
    }

    public function imprisonWizards(int $space_id, int $tier, int $player_id): void
    {
        $wizardCards = $this->getByTier($space_id, $tier);

        $imprisoned = false;
        foreach ($wizardCards as $wizardCard) {
            $wizardCard_id = (int) $wizardCard["id"];
            $Wizard = new Wizard($this->game, $wizardCard_id);
            $Wizard->imprison($player_id);
            $imprisoned = true;
        }

        if ($imprisoned) {
            $NotifManager = new NotifManager($this->game);
            $NotifManager->all(
                "message",
                clienttranslate('${player_name} imprisons wizard(s)'),
            );

            $PotionManager = new PotionManager($this->game);
            $PotionManager->fillPotion($player_id);
        }
    }

    public function freeWizard(
        int $space_id,
        int $tier,
        int $player_id,
        int $towerCard_id
    ): void {
        $wizardCards = $this->getByOwnerAndTier($space_id, $tier, $player_id);

        if (!$wizardCards) {
            $TowerManager = new TowerManager($this->game);

            $NotifManager = new NotifManager($this->game);
            $NotifManager->all(
                "failFreeWizard",
                clienttranslate('${player_name} fails to free a wizard'),
                [
                    "towerCard" => $TowerManager->getCard($towerCard_id),
                    "space_id" => $space_id,
                    "tier" => $tier,
                ],
                $player_id
            );
            return;
        }

        $wizardCard = reset($wizardCards);
        $wizardCard_id = (int) $wizardCard["id"];
        $Wizard = new Wizard($this->game, $wizardCard_id);
        $Wizard->free($player_id, $towerCard_id);
    }

    public function getByOwner(int $player_id, bool $visibleOnly): array
    {
        $wizardCards = $this->game->getCollectionFromDB("SELECT {$this->fields} FROM {$this->dbTable} 
        WHERE card_type_arg={$player_id} AND card_location='space'");
        $TowerManager = new TowerManager($this->game);

        if ($visibleOnly) {
            $wizardCards = array_filter($wizardCards, function ($wizardCard_id) use ($TowerManager) {
                $Wizard = new Wizard($this->game, $wizardCard_id);
                $space_id = $Wizard->getSpaceId();

                return $Wizard->tier === $TowerManager->countOnSpace($space_id);
            }, ARRAY_FILTER_USE_KEY);
        }

        return $wizardCards;
    }

    public function getByOwnerAndTier(int $space_id, int $tier, int $player_id): array
    {
        $wizardCards = $this->game->getCollectionFromDB("SELECT {$this->fields} FROM {$this->dbTable} 
        WHERE card_location_arg={$space_id} AND card_location='space' AND card_type_arg={$player_id} AND tier={$tier}");
        return array_values($wizardCards);
    }

    public function getMovable(int $moveCard_id, int $player_id): array
    {
        $Move = new Move($this->game, $moveCard_id);

        if ($Move->type !== "wizard" && $Move->type !== "both") {
            return [];
        }

        $wizardCards = $this->getByOwner($player_id, true);

        if ($Move->isDice()) {
            if ($this->game->gamestate->state_id() !== ST_AFTER_ROLL) {
                return array_values($wizardCards);
            }
            $steps = $this->game->globals->get(G_ROLL);
        } else {
            $steps = $Move->getSteps("wizard");
        }

        $movableWizards = array_filter($wizardCards, function ($wizardCard_id)  use ($steps, $player_id) {
            $Wizard = new Wizard($this->game, $wizardCard_id);
            return $Wizard->isMovable($steps, $player_id);
        }, ARRAY_FILTER_USE_KEY);

        return array_values($movableWizards);
    }

    public function getSpellable(int $spell_id, int $player_id): array
    {
        $Spell = new Spell($this->game, $spell_id);

        if ($Spell->type !== "wizard") {
            return [];
        }

        $steps = $Spell->steps;
        $wizardCards = $this->getByOwner($player_id, true);

        $spellableWizards = array_filter($wizardCards, function ($wizardCard_id) use ($steps, $player_id) {
            $Wizard = new Wizard($this->game, $wizardCard_id);
            return $Wizard->isMovable($steps, $player_id);
        }, ARRAY_FILTER_USE_KEY);

        return array_values($spellableWizards);
    }

    public function getRavenskeepCount(int $player_id): int
    {
        $ravenskeepCount = $this->game->getUniqueValueFromDB("SELECT COUNT(card_id) FROM {$this->dbTable} 
        WHERE card_location='ravenskeep' AND card_type_arg={$player_id}");

        return $ravenskeepCount;
    }

    public function getRavenskeepCounts(): array
    {
        $ravenskeepCounts = [];
        $players = $this->game->loadPlayersBasicInfos();

        foreach ($players as $player_id => $player) {
            $ravenskeepCounts[$player_id] = $this->getRavenskeepCount($player_id);
        }

        return $ravenskeepCounts;
    }

    public function getRavenskeepGoal(): int
    {
        $playersNbr = $this->game->getPlayersNumber();
        return $this->game->SETUP_COUNTS[$playersNbr]["wizards"];
    }

    public function goalMet(int $player_id): bool
    {
        return $this->getRavenskeepCount($player_id) === $this->getRavenskeepGoal();
    }

    public function getProgression(): float
    {
        $ravenskeepMax = max($this->getRavenskeepCounts());
        $progression = $ravenskeepMax / $this->getRavenskeepGoal();
        return $progression;
    }
}
