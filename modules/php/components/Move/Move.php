<?php

namespace Bga\Games\WanderingTowers\Components\Move;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Actions\Types\StringParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Components\Tower\TowerManager;
use Bga\Games\WanderingTowers\Components\Wizard\WizardManager;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Move extends MoveManager
{
    public int $id;
    public int $card_id;
    public string $type;
    public array $move;

    public function __construct(Table $game, #[IntParam(min: 1, max: 90)] int $moveCard_id)
    {
        parent::__construct($game);

        $this->card_id = $moveCard_id;
        $card = $this->getCard($this->card_id);

        $this->id = (int) $card["type_arg"];
        $this->move = $this->game->MOVES[$this->id];
        $this->type = (string) $this->move["type"];
    }

    public function getMoveCard(): array
    {
        return $this->getCard($this->card_id);
    }

    public function getSteps(#[StringParam(enum: ["wizard", "tower"])] string $side): int
    {
        $steps = $this->move[$side];
        return (int) $steps;
    }

    public function isDice(): bool
    {
        return $this->id >= 19;
    }

    public function getOwner()
    {
        $card = $this->getMoveCard();
        return (int) $card["location_arg"];
    }

    private function validateType(?string $side): void
    {
        if ($side !== null && $this->type !== "both" && $this->type !== $side) {
            throw new \BgaVisibleSystemException("Wrong movement type");
        }
    }

    private function validateHand(int $player_id): void
    {
        $location = $this->getMoveCard()["location"];
        $owner_id = $this->getOwner();

        if ($location !== "hand" || $owner_id !== $player_id) {
            throw new \BgaVisibleSystemException("This movement card is not in your hand");
        }
    }

    private function validateIsPlayable(int $player_id): void
    {
        if (!$this->isPlayable($player_id)) {
            throw new \BgaVisibleSystemException("You can't play this move");
        }
    }

    private function validateIsMovable(?int $card_id, ?string $side, int $player_id): void
    {
        if ($card_id === null) {
            return;
        }

        $movableMeeples = $this->getMovableMeeples($player_id);
        $cards = $movableMeeples[$this->card_id][$side];

        $inArray = false;
        foreach ($cards as $card) {
            if ($card_id === (int) $card["id"]) {
                $inArray = true;
                break;
            }
        }

        if (!$inArray) {
            throw new \BgaVisibleSystemException("You can't move this tower or wizard");
        }
    }

    public function validate(?string $side, ?int $card_id, int $player_id): void
    {
        $this->validateType($side);
        $this->validateHand($player_id);
        $this->validateIsPlayable($player_id);
        $this->validateIsMovable($card_id, $side, $player_id);
    }

    public function discard(int $player_id): void
    {
        $discardPosition = $this->countCardsInLocation("discard");
        $this->moveCard($this->card_id, "discard", $discardPosition);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "discardMove",
            clienttranslate('${player_name} discards a movement card ${move_icon}'),
            [
                "move_icon" => "",
                "moveCard" => $this->getCard($this->card_id),
                "preserve" => ["moveCard"],
            ]
        );

        $this->game->incStat(1, STAT_MOVES_DISCARDED, $player_id);
    }

    public function isPlayable(int $player_id): bool
    {
        $isPlayable = false;

        $WizardManager = new WizardManager($this->game);
        $movableWizards = $WizardManager->getMovable($this->card_id, $player_id);

        $TowerManager = new TowerManager($this->game);
        $movableTowers = $TowerManager->getMovable($this->card_id, $player_id);

        $isPlayable = !!$movableWizards || !!$movableTowers;
        return $isPlayable;
    }
}
