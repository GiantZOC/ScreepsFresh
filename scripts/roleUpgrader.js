module.exports = function (creep) {
  require('prototype.Creep')();
  var closestStorage = creep.findClosestStorage();
  //TODO review all this logic
  if (creep.memory.action == 'gather') {
    creep.upgradeController(creep.room.controller);
    var deliverer = creep.getMyTargetDeliverer();
    if(deliverer != null){
      creep.say('wait');
    }
    else if (closestStorage != null) {
      if(closestStorage.memory != null && closestStorage.memory.hordeEnergy != true){
        creep.moveTo(closestStorage);
      }
      else{
        creep.moveTo(creep.room.controller);
      }
      creep.takeMyStorageEnergy();
      creep.say('gather');
    } else {
      creep.moveTo(creep.room.controller);
      creep.say('getOutOfWay');
    }
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.action = 'upgrade';
      creep.say('upgrade');
    }
  } else if (creep.memory.action == 'upgrade') {
    creep.say('upgrade');
    creep.moveTo(creep.room.controller);
    creep.upgradeController(creep.room.controller);
    if (closestStorage != null) { // && creep.carry.energy < (creep.carryCapacity/4)
      creep.takeMyStorageEnergy();
    }

    if (creep.carry.energy == 0) {
      creep.memory.action = 'gather';
      creep.say('gather');
    }
  } else {
    creep.memory.action = 'upgrade';
  }
};
