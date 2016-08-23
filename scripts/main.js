'use strict';

//var _ = require('lodash');
var controlSpawns = require('controlSpawns');
var controlRooms = require('controlRooms');
var controlCreeps = require('controlCreeps');
var controlTowers = require('controlTowers');
var controlFlags = require('controlFlags');

var sim = 1;
var cpuLog = false;

module.exports.loop = function() {
    // executed every tick
    //memoryCleanup
    for(var i in Memory.creeps){
        if(!Game.creeps[i]) {
          var creep = Memory.creeps[i];
          //console.log('Creep Cleanup: ' + creep + ' CreepName: ' + creep.name + ' IsSpawning:' + creep.isSpawning);
          delete Memory.creeps[i];
        }
    }
    /*
    for(var i in Memory.rooms){
        if(!Game.rooms[i]) {
          var room = Memory.rooms[i];
          delete Memory.rooms[i];
        }
    }
    */



    //experimental pathfinder
    PathFinder.use(true);
    if(cpuLog){
        console.log('Before Flags ' + Game.cpu.getUsed());
    }

    controlFlags.mainLoop(cpuLog);

    if(cpuLog){
        console.log('Before Rooms ' + Game.cpu.getUsed());
    }
    controlRooms.mainLoop(cpuLog);
    controlTowers(cpuLog);

    /*
    if(cpuLog){
        console.log('Before Spawns ' + Game.cpu.getUsed());
    }

    controlSpawns(cpuLog);
    */

    if(cpuLog){
        console.log('Before Creeps ' + Game.cpu.getUsed());
    }
    controlCreeps(cpuLog);

    if(cpuLog){
        console.log('After Creeps ' + Game.cpu.getUsed());
        if(Game.cpu.getUsed() > Game.cpu.limit){
            console.log('Exceeded CPU Limit');
        }

    }
    /*
    for(var i in Game.flags){
      var flag = Game.flags[i];
      console.log('flags' + flag);
      flag.remove();
    }
    */
/*
    for(var i in Memory.flags){
        if(!Game.flags[i]) {
            delete Memory.Flags[i];
        }
    }

    for(var i in Memory.rooms){
      //var room = Memory.rooms[i];
        if(!Game.rooms[i]) {
            delete Memory.rooms[i];
        }
    }

    for(var i in Memory.spawns){
      var spawn = Memory.spawns[i];
        if(!Game.spawns[i]) {
            delete Memory.spawns[i];
        }
    }
    */

    /*Object.defineProperty(Creep.prototype, "energy", {
    enumerable : true,
    configurable : true,
    get: function () {
        return this.carry.energy;
    }
});
Object.defineProperty(Creep.prototype, "energyCapacity", {
    enumerable : true,
    configurable : true,
    get: function () {
        return this.carryCapacity;
    }
});
*/
};
