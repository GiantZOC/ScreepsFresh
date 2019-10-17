//Attacks other rooms
module.exports = function (creep) {
    require('prototype.Creep')();
    var getHostileTarget = require('getHostileTarget');
    var actionCachedMove = require('actionCachedMove');
    var profile = false;
    var currentCPU = Game.cpu.getUsed();
    //console.log('Before Spawn ' + Game.cpu.getUsed());


    var hostiles = creep.findInRange(FIND_HOSTILE_CREEPS, 1);
    var myStructures = creep.findInRange(FIND_STRUCTURES, 1);

    //ATTACK
    if(hostiles.length > 0){
       creep.attack(hostiles[0]);
    }
    else if(creep.room.controller != my && myStructures > 0){
        creep.attack(myStructures[0])
    }

    //HEAL
    if(creep.getActiveBodyparts(HEAL) > 0){
        if(this.getHealTarget()){
            rangedattackrangedheal = 'heal';
        }
    }

    //MOVE
    if(Game.flags.ram != null){
        actionCachedMove(creep, 'ramP', Game.flags.ram, {ignoreDestructibleStructures:true, ignoreCreeps:true, reusePath: 51});
    }
    hostiles = creep.findInRange(FIND_HOSTILE_CREEPS, 3);
    if(hostiles.length > 0){
        actionCachedMove(creep, 'hostileP', hostiles[0]);
    }
};
