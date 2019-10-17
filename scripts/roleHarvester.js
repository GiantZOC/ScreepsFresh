//harvests energy
module.exports = function (creep) {
  require('prototype.Creep')();
  var actionHarvest = require('actionHarvest');
  var actionDeliver = require('actionDeliver');
  var spawn = creep.getMySpawn();
  var source = creep.getMyRemoteSource();
  var myFlag = creep.getMyFlag();

  if (creep.memory.action == 'harvest') {
    actionHarvest(creep);
  } else if (creep.memory.action == 'deliver') {
    //TODO: container logic here

    var myDeliverer = creep.getCloseDeliverer();
    if (myDeliverer != null) {
      creep.transfer(myDeliverer, RESOURCE_ENERGY);
      creep.say('transfer');
      //console.log('creep: ' + creep.name + 'transferTarget: ' +  myDeliverer.name);
    } else if (creep.getMyDeliverers().length > 0){
      //actionDeliver.deliver(creep);
      creep.say('wait');
    }
    else{
      actionDeliver.deliver(creep);
    }
    if(creep.carry.energy == 0){
      creep.memory.action = 'harvest';
      actionHarvest(creep);
    }
  } else {
    creep.memory.action = 'harvest';
  }
};
