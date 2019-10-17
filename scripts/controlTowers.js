//make towers shoot stuff or heal stuff
module.exports = function (cpuLog) {
    require('prototype.Room.memory');
    var towers = _.filter(Game.structures, function (structure) {
      return structure.structureType == STRUCTURE_TOWER;
    });
    try {
      for(var i in towers) {
          var tower = towers[i];
          var hostiles = tower.room.getHostiles();
          if(hostiles.length > 0){
            tower.attack(hostiles[0]);
          }

          var damagedCreeps = tower.room.getDamagedCreeps();
          if(damagedCreeps.length > 0){
            tower.heal(damagedCreeps[0]);
          }

          //TODO: consider repair which costs 15r/e vrs creeps which get 100r/e
          //createCreeps(spawn);
      }
    } catch (err) {
      console.log('Tower: ' + tower + ' Error: ' + err  + ' stackTrace: ' + err.stack);
    }
};
