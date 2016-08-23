module.exports = function (creep) {
  require('prototype.Creep')();
  var actionDeliver = require('actionDeliver');
  var actionGetEnergy = require('actionGetEnergy');
  var actionCachedMove = require('actionCachedMove');
  //var source = creep.pos.findClosest(FIND_SOURCES);
  var currentCPU = Game.cpu.getUsed();
  //console.log('Before Spawn ' + Game.cpu.getUsed());
  var spawn = creep.getMySpawn();
  var profile = false;
  var myFlag = creep.getMyFlag();
  if (myFlag != null) {
    myFlag.memory.delivererCount++;
  }

  if (creep.memory.action == 'gather') {

    actionGetEnergy(creep);
    if (profile == true && Game.cpu.getUsed() - currentCPU > 5) {
      console.log('Deliverer actionGetEnergy ' + (Game.cpu.getUsed() - currentCPU));
    }
    creep.say('Gather');
  } else if (creep.memory.action == 'deliver') {

    actionDeliver.deliver(creep);
    if (profile == true && Game.cpu.getUsed() - currentCPU > 5) {
      console.log('Deliverer Deliver ' + (Game.cpu.getUsed() - currentCPU));
    }
    creep.say('Deliver');
  } else {
    creep.memory.action = 'gather';
  }
};
