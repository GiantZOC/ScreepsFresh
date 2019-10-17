//create creeps for each spawn
module.exports = function (cpuLog) {
    var createCreeps = require('createCreeps');
    for(var i in Game.spawns) {
        var spawn = Game.spawns[i];
        if(cpuLog){
          //console.log('BeforeCreateCreeps ' + spawn.name);
        }
        //createCreeps(spawn);
    }
};
