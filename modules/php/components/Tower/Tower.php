<?php

namespace Bga\Games\WanderingTowers\components\Tower;

use Bga\GameFramework\Actions\Types\IntParam;
use Bga\GameFramework\Table;
use Bga\Games\WanderingTowers\Notifications\NotifManager;

class Tower extends TowerManager
{
    public int $card_id;

    public function __construct(Table $game, #[IntParam(min: 1, max: 10)] int $towerCard_id)
    {
        parent::__construct($game);
        $this->card_id = $towerCard_id;
    }

    public function getSpaceId(): int
    {
        $TowerCard = (array) $this->getCard($this->card_id);
        return $TowerCard["location_arg"];
    }

    public function moveBySteps(int $steps): void
    {
        $space_id = $this->getSpaceId($this->card_id);
        $space_id = $space_id = $steps;

        $this->moveByLocationArg($this->card_id, $space_id);

        $NotifManager = new NotifManager($this->game);
        $NotifManager->all(
            "moveTower",
            clienttranslate('${player_name} moves a tower by ${steps_label} space(s)'),
            [
                "steps" => $steps,
                "steps_label" => $steps
            ]
        );
    }
}
