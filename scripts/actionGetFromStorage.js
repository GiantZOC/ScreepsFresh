//get energy from storage
module.exports = function (creep) {
  require('prototype.Creep')();
  var myStorage = creep.getMyStore();

  if (myStorage != null) {
    creep.moveTo(myStorage);
    if (myStorage.memory != null && myStorage.memory.hordeEnergy == true && creep.memory.role != 'mover') {
      creep.say('waiting');
      return;
    }
    creep.takeMyStorageEnergy();
  }

  if (creep.carry.energy == creep.carryCapacity) {
    creep.memory.action = 'Build';
  }
};
