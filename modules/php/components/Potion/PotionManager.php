<?php

namespace Bga\Games\WanderingTowers\Components\Potion;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;
use Bga\Games\WanderingTowers\Score\ScoreManager;

class PotionManager extends CardManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game, $game->potion_cards, "potion");
    }

    public function setupCards(): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $playerNbr = count($players);

        $setupCounts = (array) $this->game->SETUP_COUNTS[$playerNbr];
        $potionCount = (int) $setupCounts["potions"];

        $gameinfos = $this->game->getGameinfos();
        $colors = $gameinfos["player_colors"];

        $potionCards = [];
        foreach ($players as $player_id => $player) {
            $color = $player["player_color"];
            $k_color = array_search($color, $colors);

            $potionCards[] = ["type" => $k_color, "type_arg" => $player_id, "nbr" => $potionCount];
        }
        $this->createCards($potionCards);

        $isSolo = $this->game->isSolo();
        if ($isSolo) {
            if ($this->game->tableOptions->get(OPT_SPELLS_SOLO) > 0) {
                $player_id = (int) $this->game->getActivePlayerId();
                $this->game->DbQuery("UPDATE potion SET card_location='filled', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
            }

            return;
        }

        foreach ($players as $player_id => $player) {
            $this->game->DbQuery("UPDATE potion SET card_location='empty', card_location_arg={$player_id} WHERE card_type_arg={$player_id}");
        }
    }

    public function getCargos(): array
    {
        $potionCards = $this->game->getCollectionFromDB("SELECT {$this->fields} FROM {$this->dbTable} WHERE card_location='empty' OR card_location='filled'");
        return array_values($potionCards);
    }

    public function fillPotion(int $player_id): void
    {
        if ($this->game->isSolo()) {
            return;
        }

        $potionCard = $this->getCardInLocation("empty", $player_id, true);

        if (!$potionCard) {
            return;
        }

        $potionCard_id = (int) $potionCard["id"];

        $this->moveCard($potionCard_id, "filled", $player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "fillPotion",
            "",
            [
                "potionCard" => $this->getCard($potionCard_id),
            ],
            $player_id,
        );

        $ScoreManager = new ScoreManager($this->game);
        $ScoreManager->incScore(1, $player_id);
        $ScoreManager->incScoreAux(1, $player_id);

        $this->game->incStat(1, STAT_POTIONS_FILLED, $player_id);
    }


    public function countFilled(int $player_id): int
    {
        return $this->countCardsInLocation("filled", $player_id);
    }

    public function countEmpty(int $player_id): int
    {
        return $this->countCardsInLocation("empty", $player_id);
    }

    public function usePotions(int $nbr, int $player_id): void
    {
        $this->game->DbQuery("UPDATE {$this->dbTable} SET card_location='discard' WHERE card_location='filled' AND card_location_arg={$player_id} LIMIT {$nbr}");

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "usePotions",
            "",
            [
                "nbr" => $nbr,
            ],
            $player_id,
        );

        $this->game->incStat($nbr, STAT_POTIONS_USED, $player_id);
        $ScoreManager = new ScoreManager($this->game);
        $ScoreManager->incScoreAux(-$nbr, $player_id);
    }

    public function getPotionsGoal(): int
    {
        $playersNbr = $this->game->getPlayersNumber();
        return $this->game->isSolo() ? 0 : $this->game->SETUP_COUNTS[$playersNbr]["potions"];
    }

    public function goalMet(int $player_id): bool
    {
        $emptyPotionsCount = $this->countEmpty($player_id);
        return $emptyPotionsCount === 0;
    }
}
