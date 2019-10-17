//moves energy from storage into extensions
module.exports = function (creep) {
  var actionGetFromStorage = require('actionGetFromStorage');
  require('prototype.Creep')();
  var actionCachedMove = require('actionCachedMove');
  if (creep.memory.action == 'storage') {
    actionGetFromStorage(creep);
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.action = 'extension';
    }

  } else if (creep.memory.action == 'extension') {
    if (creep.getMyTower() != null) {
      var tower = creep.getMyTower();
      //actionCachedMove(creep, 'towerP', tower);
      creep.moveTo(tower);
      creep.transfer(tower, RESOURCE_ENERGY);
    }
    else if (creep.getMyExtension() != null) {
      var extension = creep.getMyExtension();
      //actionCachedMove(creep, 'extensionP', extension);
      creep.moveTo(extension);
      creep.transfer(extension, RESOURCE_ENERGY);
    } else {
      var spawn = creep.getMySpawn();
      if (spawn != null) {
        //actionCachedMove(creep, 'spawnP', spawn);
        creep.moveTo(spawn);
        creep.transfer(spawn, RESOURCE_ENERGY);
      }
    }
    if (creep.carry.energy == 0) {
      creep.memory.action = 'storage';
    }
  } else {
    creep.memory.action = 'storage';
  }
};
