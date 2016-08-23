module.exports = function (creep) {
  require('prototype.Creep')();
  var actionCachedMove = require('actionCachedMove');
  var source = creep.getMyRemoteSource();

  if (source != null) {
    actionCachedMove(creep, 'harvestP', source);
    creep.harvest(source);
    var myDeliverer = creep.getCloseDeliverer();
    //TODO: Container logic here
    if (myDeliverer != null) {
      creep.transfer(myDeliverer, RESOURCE_ENERGY);
    }
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.action = 'deliver';
      creep.say('deliver');
    }
  } else {
    myFlag = creep.getMyFlag();
    if (myFlag != null) {
      actionCachedMove(creep, 'flagP', myFlag, {
        maxOps: 5000
      });
    }
  }
};
