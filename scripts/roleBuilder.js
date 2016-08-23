module.exports = function (creep) {
  var actionGetFromStorage = require('actionGetFromStorage');
  var actionBuild = require('actionBuild');
  require('prototype.Creep')();
  if (creep.memory.action == 'actionGetEnergy') {
    var myDeliverer = creep.getMyDeliverer();
    if(myDeliverer != null){
      creep.say('wait');
    }
    else{
      if (creep.getMyTargetDeliverer() != null){
        creep.say('wait');
      } else{
        actionGetFromStorage(creep);
      }
    }
    if(creep.energy == creep.energyCapacity){
      creep.memory.action = 'actionBuild';
    }
  } else {
    actionBuild(creep);
  }
};
