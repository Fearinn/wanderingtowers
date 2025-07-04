{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- WanderingTowers implementation : © Matheus Gomes matheusgomesforwork@gmail.com
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------
-->
<div id="wtw_moveHand" class="wtw_moveHand"></div>
<div id="wtw_gameArea" class="wtw_gameArea">
  <div id="wtw_board" class="wtw_board">
    <div id="wtw_boardCenter" class="wtw_boardCenter">
      <div id="wtw_moveDeck" class="wtw_moveDeck"></div>
      <div id="wtw_dice" class="wtw_dice"></div>
      <div id="wtw_moveDiscard" class="wtw_whiteblock wtw_moveDiscard">
        <span
          id="wtw_discardCounter"
          class="wtw_deckCounter bga-cards_deck-counter text-shadow wtw_discardCounter"
          >0</span
        >
        <span class="wtw_discardTitle">Discard</span>
      </div>
      <div id="wtw_spells" class="wtw_spells"></div>
      <div id="wtw_potionVoid" class="wtw_potionVoid"></div>
    </div>
    <div id="wtw_spacesContainer" class="wtw_spacesContainer">
      <div id="wtw_tiles" class="wtw_tiles">
        <div class="wtw_tile wtw_tile-1"></div>
        <div class="wtw_tile wtw_tile-2"></div>
        <div class="wtw_tile wtw_tile-3"></div>
        <div class="wtw_tile wtw_tile-4"></div>
      </div>
      <div id="wtw_spaceWizardsContainer" class="wtw_spaceWizardsContainer">
        <div
          id="wtw_spaceWizards-1"
          class="wtw_spaceWizards"
          data-space="1"
        ></div>
        <div
          id="wtw_spaceWizards-2"
          class="wtw_spaceWizards"
          data-space="2"
        ></div>
        <div
          id="wtw_spaceWizards-3"
          class="wtw_spaceWizards"
          data-space="3"
        ></div>
        <div
          id="wtw_spaceWizards-4"
          class="wtw_spaceWizards"
          data-space="4"
        ></div>
        <div
          id="wtw_spaceWizards-5"
          class="wtw_spaceWizards"
          data-space="5"
        ></div>
        <div
          id="wtw_spaceWizards-6"
          class="wtw_spaceWizards"
          data-space="6"
        ></div>
        <div
          id="wtw_spaceWizards-7"
          class="wtw_spaceWizards"
          data-space="7"
        ></div>
        <div
          id="wtw_spaceWizards-8"
          class="wtw_spaceWizards"
          data-space="8"
        ></div>
        <div
          id="wtw_spaceWizards-9"
          class="wtw_spaceWizards"
          data-space="9"
        ></div>
        <div
          id="wtw_spaceWizards-10"
          class="wtw_spaceWizards"
          data-space="10"
        ></div>
        <div
          id="wtw_spaceWizards-11"
          class="wtw_spaceWizards"
          data-space="11"
        ></div>
        <div
          id="wtw_spaceWizards-12"
          class="wtw_spaceWizards"
          data-space="12"
        ></div>
        <div
          id="wtw_spaceWizards-13"
          class="wtw_spaceWizards"
          data-space="13"
        ></div>
        <div
          id="wtw_spaceWizards-14"
          class="wtw_spaceWizards"
          data-space="14"
        ></div>
        <div
          id="wtw_spaceWizards-15"
          class="wtw_spaceWizards"
          data-space="15"
        ></div>
        <div
          id="wtw_spaceWizards-16"
          class="wtw_spaceWizards"
          data-space="16"
        ></div>
      </div>
      <div id="wtw_spaceTowersContainer" class="wtw_spaceTowersContainer">
        <div id="wtw_spaceTowers-1" class="wtw_spaceTowers" data-space="1">
          <div id="wtw_tierCounter-1" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-2" class="wtw_spaceTowers" data-space="2">
          <div id="wtw_tierCounter-2" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-3" class="wtw_spaceTowers" data-space="3">
          <div id="wtw_tierCounter-3" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-4" class="wtw_spaceTowers" data-space="4">
          <div id="wtw_tierCounter-4" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-5" class="wtw_spaceTowers" data-space="5">
          <div id="wtw_tierCounter-5" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-6" class="wtw_spaceTowers" data-space="6">
          <div id="wtw_tierCounter-6" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-7" class="wtw_spaceTowers" data-space="7">
          <div id="wtw_tierCounter-7" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-8" class="wtw_spaceTowers" data-space="8">
          <div id="wtw_tierCounter-8" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-9" class="wtw_spaceTowers" data-space="9">
          <div id="wtw_tierCounter-9" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-10" class="wtw_spaceTowers" data-space="10">
          <div id="wtw_tierCounter-10" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-11" class="wtw_spaceTowers" data-space="11">
          <div id="wtw_tierCounter-11" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-12" class="wtw_spaceTowers" data-space="12">
          <div id="wtw_tierCounter-12" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-13" class="wtw_spaceTowers" data-space="13">
          <div id="wtw_tierCounter-13" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-14" class="wtw_spaceTowers" data-space="14">
          <div id="wtw_tierCounter-14" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-15" class="wtw_spaceTowers" data-space="15">
          <div id="wtw_tierCounter-15" class="wtw_tierCounter"></div>
        </div>
        <div id="wtw_spaceTowers-16" class="wtw_spaceTowers" data-space="16">
          <div id="wtw_tierCounter-16" class="wtw_tierCounter"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript"></script>

{OVERALL_GAME_FOOTER}
