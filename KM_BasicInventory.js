/*:
@plugindesc KM Crafting System
@author https://github.com/RareJay

Based on: armornick SimpleCraftingSystem

----------------------------------------------------

@help

Adds a simple crafting system with a simple crafting menu.

===   Plugin Commands      ===

The inventory system plugin adds one new plugin commands.

The plugin command opens the crafting menu, and takes
no arguments:

    show_inventory

===   Scripting Commands   ===

To open the crafting menu, use the following script command:
    SceneManager.push(Scene_Inventory)

*/

var Imported = Imported || {};
Imported.KM_BasicInventory = 1;

//-----------------------------------------------------------------------------
// Global Constructors

function Scene_Inventory() {
  this.initialize.apply(this, arguments);
}



//=============================================================================
(function () {

  //-----------------------------------------------------------------------------
  // DataManager
  //
  // Quick patch to fix the crafting system breaking on load.

  var KM_BasicInventory_DataManager_extractSaveContents = DataManager.extractSaveContents;    
  DataManager.extractSaveContents = function (contents) {
    KM_BasicInventory_DataManager_extractSaveContents.call(this, contents);
   }

  //-----------------------------------------------------------------------------
  // Game_Recipe
  //
  // The game object class for the recipes. Contains a list of ingredients.


  //-----------------------------------------------------------------------------
  // Game_Party
  var KM_BasicInventory_GameParty_initialize = Game_Party.prototype.initialize;
  Game_Party.prototype.initialize = function() {
    KM_BasicInventory_GameParty_initialize.call(this);
  }
  
  //-----------------------------------------------------------------------------
  // Window_InventoryList
  //
  // The window for showing the list of ingredients for the selected recipe.

  function Window_InventoryList() {
    this.initialize.apply(this, arguments);
  }

  Window_InventoryList.prototype = Object.create(Window_ItemList.prototype);
  Window_InventoryList.prototype.constructor = Window_InventoryList;

  Window_InventoryList.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
  };

  Window_InventoryList.prototype.select = function(index) {
    Window_Selectable.prototype.select.call(this, index);
  };

  Window_IngredientList.prototype.isEnabled = function(item) {
    var container = this.itemContainer();

    return true;
};


  Window_InventoryList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems();
    console.log("makeItemList: ", this._data);  // Log the items in the inventory
  };

  Window_InventoryList.prototype.updateHelp = function() {
    var item = this.item();  // Get the currently selected item
    console.log("updateHelp - current item: ", item);  // Log the current item
    this.setHelpWindowItem(item);  // Set the help window item
  };
  
  Window_Selectable.prototype.item = function() {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
  };
  
  Window_InventoryList.prototype.numberWidth = function() {
    return this.textWidth('00');
  };


  Window_InventoryList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
        this.drawText('', x, y, width - this.textWidth('00 '), 'right');
    }
  };

  //$gameParty.allItems()[2].name
  Window_InventoryList.prototype.drawItem = function(index) {
      var item = this._data[index];
      console.log("drawItem: ", item);  // Log the item being drawn

      if (item) {
          //var numberWidth = this.numberWidth();
          var rect = this.itemRect(index);
          rect.width -= this.textPadding();
          // Change text color based on selection state
          if (this.index() === index) {
            this.changeTextColor(this.textColor(14)); // different color
          } else {
            this.changeTextColor(this.textColor(0)); // Default color 
          }

          this.changePaintOpacity(this.isEnabled(item));
          this.drawItemName(item, rect.x, rect.y, rect.width);
          this.drawItemNumber(item, rect.x, rect.y, rect.width);
          this.changePaintOpacity(1);
      }
  };

  //-----------------------------------------------------------------------------
  // Scene_Inventory
  //
  // The scene class of the inventory system.
  Scene_Inventory.prototype = Object.create(Scene_ItemBase.prototype);
  Scene_Inventory.prototype.constructor = Scene_Inventory;

  Scene_Inventory.prototype.initialize = function() {
      Scene_ItemBase.prototype.initialize.call(this);
  };

  Scene_Inventory.prototype.create = function() {
      Scene_ItemBase.prototype.create.call(this);
      this.createHelpWindow();
      this.createInventoryWindow();
  };

  Scene_Inventory.prototype.createInventoryWindow = function () {
      // /////: calculate ingredient window rect
      var x = 0;
      var y = this._helpWindow.height;
      var wx = Graphics.boxWidth;
      var wy = Graphics.boxHeight - this._helpWindow.height;
      this._inventoryWindow = new Window_InventoryList(x, y, wx, wy);
      this._inventoryWindow.setHelpWindow(this._helpWindow);
      this._inventoryWindow.setHandler('cancel', this.popScene.bind(this));
      this.addWindow(this._inventoryWindow);
  };

  Scene_Inventory.prototype.start = function() {
    Scene_ItemBase.prototype.start.call(this);
    this._inventoryWindow.refresh();
    this._inventoryWindow.activate();
    this._inventoryWindow.selectLast();
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var KM_BasicInventory_GameSystem_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    KM_BasicInventory_GameSystem_initialize.call(this);
    
      }

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var KM_BasicInventory_GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
      Game_Interpreter.prototype.pluginCommand = function(command, args) {
        KM_BasicInventory_GameInterpreter_pluginCommand.call(this, command, args);
          command = command.toLowerCase();

          if (command === "show_inventory") {
              SceneManager.push(Scene_Inventory);
          }
      };

}())