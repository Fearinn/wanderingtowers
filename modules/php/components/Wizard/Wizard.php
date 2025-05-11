<?php

namespace Bga\Games\WanderingTowers\components\Wizard;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Wizard extends WizardManager
{
    public int $card_id;
    public int $owner;

    public function __construct(Table $game, #[IntParam(min: 1, max: 18)] int $wizardCard_id)
    {
        parent::__construct($game);
        $this->card_id = $wizardCard_id;
        $card = $this->getCard($this->card_id);

        $this->owner = (int) $card["type_arg"];
    }

    public function getSpaceId(): int
    {
        $wizardCard = (array) $this->getCard($this->card_id);
        return $wizardCard["location_arg"];
    }

    public function moveBySteps(int $steps): void
    {
        $space_id = $this->getSpaceId($this->card_id);
        $space_id += $steps;

        $this->moveByLocationArg($this->card_id, $space_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveWizard",
            clienttranslate('${player_name} moves a wizard by ${steps_label} spaces'),
            [
                "space_id" => $space_id,
                "card" => $this->getCard($this->card_id),
                "steps" => $steps,
                "steps_label" => $steps
            ]
        );
    }

    public function validateOwner(int $player_id): void
    {
        if ($this->owner !== $player_id) {
            throw new \BgaVisibleSystemException("Invalid wizard owner");
        }
    }
}
