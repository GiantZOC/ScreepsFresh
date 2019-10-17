//shared global functions
module.exports = {

  //TODO: rewrite to use room and then filter

  pathCost: function (path) { //TODO: find a way to fix this, position must contain room
    console.log('path: ' + path);
    var totalCost = 0;
    for (var pathIterate = 0; pathIterate < path.length; pathIterate++) {
      var position = path[pathIterate];
      totalCost += this.terrainCost(position);
    }
    return totalCost;
  },

  //TODO: other resources
  transfer: function (creep, storage, toCreep) {
    if (toCreep) {
      if (storage.structureType == STRUCTURE_SPAWN && storage.memory.hordeEnergy == true) {
        return;
      }
      if(storage.structureType == STRUCTURE_STORAGE){
        storage.transfer(creep, RESOURCE_ENERGY, creep.carry.energyCapacity - creep.carry.energy);
      }
      else{
        storage.transferEnergy(creep, creep.carry.energyCapacity - creep.carry.energy);
      }
    } else {
      //TODO capacity logic
      creep.transfer(storage, RESOURCE_ENERGY, creep.carry.energy);
    }
  },

};
