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
        <span class="wtw_moveDiscardTitle">Discard</span>
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
        <div id="wtw_spaceWizards-1" class="wtw_spaceWizards" data-space="1">
          <div id="wtw_wizardTier-1-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-1-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-2" class="wtw_spaceWizards" data-space="2">
          <div id="wtw_wizardTier-2-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-2-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-3" class="wtw_spaceWizards" data-space="3">
          <div id="wtw_wizardTier-3-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-3-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-4" class="wtw_spaceWizards" data-space="4">
          <div id="wtw_wizardTier-4-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-4-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-5" class="wtw_spaceWizards" data-space="5">
          <div id="wtw_wizardTier-5-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-5-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-6" class="wtw_spaceWizards" data-space="6">
          <div id="wtw_wizardTier-6-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-6-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-7" class="wtw_spaceWizards" data-space="7">
          <div id="wtw_wizardTier-7-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-7-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-8" class="wtw_spaceWizards" data-space="8">
          <div id="wtw_wizardTier-8-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-8-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-9" class="wtw_spaceWizards" data-space="9">
          <div id="wtw_wizardTier-9-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-9-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-10" class="wtw_spaceWizards" data-space="10">
          <div id="wtw_wizardTier-10-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-10-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-11" class="wtw_spaceWizards" data-space="11">
          <div id="wtw_wizardTier-11-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-11-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-12" class="wtw_spaceWizards" data-space="12">
          <div id="wtw_wizardTier-12-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-12-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-13" class="wtw_spaceWizards" data-space="13">
          <div id="wtw_wizardTier-13-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-13-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-14" class="wtw_spaceWizards" data-space="14">
          <div id="wtw_wizardTier-14-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-14-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-15" class="wtw_spaceWizards" data-space="15">
          <div id="wtw_wizardTier-15-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-15-10" class="wtw_wizardTier"></div>
        </div>
        <div id="wtw_spaceWizards-16" class="wtw_spaceWizards" data-space="16">
          <div id="wtw_wizardTier-16-1" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-2" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-3" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-4" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-5" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-6" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-7" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-8" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-9" class="wtw_wizardTier"></div>
          <div id="wtw_wizardTier-16-10" class="wtw_wizardTier"></div>
        </div>
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
