module.exports = function (creep) {

  require('prototype.Creep')();
  var actionCachedMove = require('actionCachedMove');
  var actionDeliver = require('actionDeliver');

  var targetCreep = creep.getHarvesterWithSameFlag();
  var flag = creep.getMyFlag();
  if (targetCreep != null) { //&& creep.pos.getRangeTo(targetCreep) < 5
    actionCachedMove(creep, 'harvesterP', targetCreep);
    //don't block source node
    if(creep.memory.stay == true){
      var range = creep.pos.getRangeTo(flag);
      console.log('Range: ' + range);
      //var sources = creep.pos.findInRange(memory.getRoomSources(creep.room), 1);
      if (range <= 1) {
        creep.getRetreatPath(flag)
      }
    }

  } else {

    if (flag != null) {
      actionCachedMove(creep, 'flagP', flag);
    }
  }

  if (creep.carry.energy == creep.carryCapacity) {
    creep.memory.action = 'deliver';
    creep.say('deliver');
    actionDeliver.deliver(creep);
  }
};
