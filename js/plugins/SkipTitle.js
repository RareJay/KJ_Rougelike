/*:
 * @plugindesc Skip Title Screen
 * @author 
 */
/* jshint -W097 */
/* jshint -W117 */




(function () {
  //------------------------------------------------------------------------------
  //Scene_Boot
  Scene_Boot.prototype.start = function () {
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
      DataManager.setupBattleTest();
      SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
      DataManager.setupEventTest();
      SceneManager.goto(Scene_Map);
    } else {
      this.checkPlayerLocation();
      DataManager.setupNewGame();
      SceneManager.goto(Scene_Map);
    }
  };


})();
