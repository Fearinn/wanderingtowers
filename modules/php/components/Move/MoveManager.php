<?php

namespace Bga\Games\WanderingTowers\Components\Move;

use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\CardManager;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class MoveManager extends CardManager
{
    public function __construct(Table $game)
    {
        parent::__construct($game, $game->move_cards, "move");
    }

    public function setupCards(): void
    {
        $move_cards = [];
        foreach ($this->game->MOVES as $move_id => $move) {
            $move_cards[] = ["type" => $move["type"], "type_arg" => $move_id, "nbr" => $move["count"]];
        }
        $this->createShuffledCards($move_cards);

        $players = $this->game->loadPlayersBasicInfos();
        foreach ($players as $player_id => $player) {
            $this->pickCards(3, $player_id);
        }
    }

    public function getDiscard(): array
    {
        return $this->getCardsInLocation("discard");
    }

    public function draw(int $nbr, int $player_id): void
    {
        $cards = $this->pickCards($nbr, $player_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->player(
            $player_id,
            "drawMovePriv",
            "",
            [
                "cards" => $cards,
            ]
        );

        $NotifManager->all(
            "drawMove",
            "",
            [
                "cards" => $this->hideCards($cards),
            ]
        );
    }

    public function getPlayable(int $player_id): array
    {
        $playableMoves = [];

        foreach ($this->getPlayerHand($player_id) as $moveCard) {
            $moveCard_id = (int) $moveCard["id"];
            $Move = new Move($this->game, $moveCard_id);

            if ($Move->isPlayable($player_id)) {
                $playableMoves[] = $Move->getMoveCard();
            }
        }

        return $playableMoves;
    }

    public function getMovableMeeples(int $player_id): array
    {
        $movableMeeples = [];

        $playableMoves = $this->getPlayable($player_id);

        $WizardManager = new WizardManager($this->game);
        $TowerManager = new TowerManager($this->game);

        foreach ($playableMoves as $moveCard) {
            $moveCard_id = (int) $moveCard["id"];
            $Move = new Move($this->game, $moveCard_id);

            $movableWizards = $WizardManager->getMovable($Move->card_id, $player_id);
            $movableTowers = $TowerManager->getMovable($Move->card_id);

            $movableMeeples[$Move->card_id] = [
                "wizard" => $movableWizards,
                "tower" => $movableTowers
            ];
        }
        
        return $movableMeeples;
    }
}
