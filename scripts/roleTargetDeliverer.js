module.exports = function (creep) {
  
  require('prototype.Creep')();
  var spawn = creep.getMySpawn();
  var actionCachedMove = require('actionCachedMove');
  var globalFunctions = require('globalFunctions');

  if (creep.memory.action == 'gather') {
    //creep.say('GatherU');
    var closestStorage = creep.findClosestStorage();
    if (closestStorage != null) {
      creep.moveTo(closestStorage);
      creep.takeMyStorageEnergy();
      creep.say('takeEnergy');
    }

    if (closestStorage.memory != null && closestStorage.memory.hordeEnergy == true && creep.memory.targetRole == 'upgrader') {
      creep.moveTo(creep.room.controller);
      creep.say('horde');
    }

    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.action = 'deliver';

    }
  } else if (creep.memory.action == 'deliver') {
    //creep.say('DeliverU');
    //console.log(creep.memory.targetRole);
    var targetCreep = creep.getMyTargetCreep();
    if (targetCreep != null) { // && targetCreep.carry.energy > 5 && targetCreep.pos.findInRange(FIND_SOURCES, 1).length > 0
      actionCachedMove(creep, 'upgraderP', targetCreep);
      if (creep.pos.getRangeTo(creep.room.controller) < 2) {
        creep.getRetreatPath(creep.room.controller)
      }
      creep.transfer(targetCreep, RESOURCE_ENERGY);
    } else if (creep.memory.targetRole == 'upgrader') {
      actionCachedMove(creep, 'controllerP', creep.room.controller, {
        ignoreCreeps: true
      });
    } else if (creep.memory.targetRole == 'builder') {
      actionCachedMove(creep, 'builderP', targetCreep);
    } else {
      creep.say('problems');
    }
    if (creep.carry.energy == 0) {
      creep.memory.action = 'gather';
      creep.say('gather');
    }
  } else {
    creep.memory.action = 'gather';
  }
};
