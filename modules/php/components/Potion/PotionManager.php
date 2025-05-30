<?php

namespace Bga\Games\WanderingTowers\Components\Potion;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

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
        $potionCard = $this->getCardInLocation("empty", $player_id);

        if (!$potionCard) {
            throw new \BgaVisibleSystemException("Potion not found");
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
    }
}
