module.exports = function (creep) {
  require('prototype.Creep')();
  require('prototype.Room.memory')();
  var actionCachedMove = require('actionCachedMove');
  var room = creep.getMyRoom();
  var action = creep.room.getBuildAction(room);
  var buildTarget = creep.room.getBuildTarget(room);
  if (buildTarget != null) {
    //console.log('Upgrade');
    //actionCachedMove(creep, target.id, target);
    var range = creep.pos.getRangeTo(buildTarget);
    if(range > 3){
      creep.moveTo(buildTarget);
    }
    if(buildTarget.hits != null){
      creep.repair(buildTarget);
    }
    else{
      creep.build(buildTarget);
    }
  } else {
    creep.moveTo(creep.room.controller);
    //actionCachedMove(creep, 'controlP', creep.room.controller);
    creep.upgradeController(creep.room.controller);
    action = 'Upgrade';
  }

  if (creep.carry.energy == 0) {
    creep.memory.action = 'actionGetEnergy';
    action = 'actionGetEnergy';
  }
  creep.say(action);
};
