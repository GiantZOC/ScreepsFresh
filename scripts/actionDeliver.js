module.exports = {
  deliver: function (creep) {
    require('prototype.Creep');
    var actionCachedMove = require('actionCachedMove');
    var actionGetEnergy = require('actionGetEnergy');
    var myStore = creep.getMyStore();

    if (myStore != null) {
      actionCachedMove(creep, 'storeP', myStore, {
        reusePath: 11,
        maxOps: 5000
      });

      creep.transfer(myStore, RESOURCE_ENERGY);

      //stop crowding the spawn

      if (creep.waiting() && myStore.memory.waitingCount > 6) { //&& creep.pos.inRangeTo(myStore, 3)
        creep.cancelOrder('move');
        creep.say('waiting');
      }

    }

    if (creep.carry.energy == 0) {
      creep.memory.action = 'harvest';
      creep.say('actionGetEnergy');
      actionGetEnergy(creep);
    }
  },

};
