//ranged attacking unit
module.exports = function (creep) {
  require('prototype.Creep')();
    var actionCachedMove = require('actionCachedMove');
    var profile = false;
    var currentCPU = Game.cpu.getUsed();
    var healrepairbuildattackharvest = '';
    var rangedattackrangedheal = '';
    //console.log('Before Spawn ' + Game.cpu.getUsed());
    var spawn = creep.getMySpawn();

    var bRetreat = creep.hits < creep.hitsMax/2;
    var bAttack = (creep.hits > creep.hitsMax - 200);
    if(profile && Game.cpu.getUsed() - currentCPU > 5){
        console.log('Before Blocked ' + (Game.cpu.getUsed() - currentCPU));
        currentCPU = Game.cpu.getUsed();
    }
    currentCPU = Game.cpu.getUsed();

    if(profile && Game.cpu.getUsed() - currentCPU > 5){
        console.log('Before Unblocked ' + (Game.cpu.getUsed() - currentCPU));
        currentCPU = Game.cpu.getUsed();
    }
    currentCPU = Game.cpu.getUsed();


    //if(profile && Game.cpu.getUsed() - currentCPU > 5){
    //    console.log('Before Hostile ' + (Game.cpu.getUsed() - currentCPU));
    //    currentCPU = Game.cpu.getUsed();
    //}

    if(profile && Game.cpu.getUsed() - currentCPU > 5){
        console.log('Before Structure ' + (Game.cpu.getUsed() - currentCPU));
        currentCPU = Game.cpu.getUsed();
    }
    var bDestroy = false;
    for(var flagIterate = 1; flagIterate < 10; flagIterate++){
        flagName = 'Destroy' + flagIterate;
        flag = Game.flags[flagName];
        if(flag != null && flag.room == creep.room){
            bDestroy = true;
        }
    }
    //creep.rangedMassAttack();
    //console.log('EnemyStructure:' + enemyStructure);
    //enemyStructure = null;
    if(creep.getActiveBodyparts(HEAL) > 0){
        if(creep.getHealTarget()){
            rangedattackrangedheal = 'heal';
        }
    }
    if(creep.getHostileTarget(bRetreat, bAttack)){

    }
    /*
    else if(bRetreat){
        if(Game.flags.archerRetreat != null){
            creep.moveTo(Game.flags.archerRetreat);
            creep.say('archRetreat');
        }
    }
    */
    else if(this.getHostileSpawn(false) != null){
        var hostileUnblockedSpawn = this.getHostileSpawn(false);
        console.log(hostileUnblockedSpawn);
        creep.say('unblocked');
        creep.moveTo(hostileUnblockedSpawn, {ignoreDestructibleStructures:false, ignoreCreeps:false, reusePath: 51});

        //creep.say(creep.pos.getRangeTo(hostileUnblockedSpawn));
        var range = creep.pos.getRangeTo(hostileUnblockedSpawn);
        if(range < 4){
            creep.rangedAttack(hostileUnblockedSpawn);
        }
        if(range < 1){
            creep.rangedAttack(hostileUnblockedSpawn);
            creep.attack(hostileUnblockedSpawn);
        }
        else{
            creep.rangedMassAttack();
        }
    }
    else if(this.getHostileSpawn( true) != null){
        var hostileBlockedSpawn = this.getHostileSpawn( true);
        var enemyStructure = this.getMyEnemyStructure();
        var anyStructure = this.getMyNeutralStructure();
        //creep.say('eSpawn');
        //if(creep.findClosestPathTo(hostileSpawn))
        actionCachedMove(creep, 'hostileSpawnP', hostileBlockedSpawn, {ignoreDestructibleStructures:true, ignoreCreeps:false, reusePath: 51});
        creep.say('hostile');
        //console.log(creep.move);
        var range = creep.pos.getRangeTo(hostileBlockedSpawn);
        //console.log(enemyStructure);
        if(range < 4){
            creep.rangedAttack(hostileBlockedSpawn);
            rangedattackrangedheal = 'attack';
        }
        else if(enemyStructure != null){
            creep.say('eStructure');
            creep.rangedAttack(enemyStructure);
            rangedattackrangedheal = 'attack';
            //creep.moveTo(enemyStructure);
        }
        else if(anyStructure != null){
            creep.say('aStructure');
            creep.rangedAttack(anyStructure);
            rangedattackrangedheal = 'attack';
        }

    }
    else if(bDestroy){
        creep.say('Destroy');
        //creep.rangedMassAttack();
        actionCachedMove(creep, 'destoryP', Game.flags.archerAttack, {reusePath: 21, maxOps: 10000, heuristicWeight:1000, ignoreDestructibleStructures:true})

        var enemyStructure = creep.getMyEnemyStructure();
        var anyStructure = creep.getMyNeutralStructure();
        if(enemyStructure != null){
            creep.rangedAttack(enemyStructure);
            creep.moveTo(enemyStructure);
            rangedattackrangedheal = 'attack';
        }
        else if(anyStructure != null){
            creep.rangedAttack(anyStructure);
            creep.moveTo(anyStructure);
            rangedattackrangedheal = 'attack';
        }
        else{
             var eStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
             if(eStructure != null){
                creep.rangedAttack(eStructure);
                creep.moveTo(eStructure);
                rangedattackrangedheal = 'attack';
             }
        }

    }
    else if(Game.flags.archerStaging1 != null && creep.memory.staging1 == null || creep.memory.staging1 == false)
    {
        creep.say('staging1');
        actionCachedMove(creep, 'stagingP', Game.flags.archerStaging1, {reusePath: 21, maxOps: 10000, heuristicWeight:1000, ignoreDestructibleStructures:false})
        if(creep.room == Game.flags.archerStaging1.room){
            creep.memory.staging1 = true;
        }
    }
    else if(Game.flags.archerStaging2 != null && creep.memory.staging2 == null || creep.memory.staging2 == false)
    {
        creep.say('staging2');
        actionCachedMove(creep, 'stagingP', Game.flags.archerStaging2, {reusePath: 21, maxOps: 10000, heuristicWeight:1000, ignoreDestructibleStructures:false})
        if(creep.room == Game.flags.archerStaging2.room){
            creep.memory.staging2 = true;
        }
    }
    else if(Game.flags.archerStaging3 != null && creep.memory.staging3 == null || creep.memory.staging3 == false)
    {
        creep.say('staging3');
        actionCachedMove(creep, 'stagingP', Game.flags.archerStaging3, {reusePath: 21, maxOps: 10000, heuristicWeight:1000, ignoreDestructibleStructures:false})
        if(creep.room == Game.flags.archerStaging3.room){
            creep.memory.staging3 = true;
        }
    }

    else if(Game.flags.archerStaging4 != null && creep.memory.staging4 == null || creep.memory.staging4 == false)
    {
        creep.say('staging4');
        actionCachedMove(creep, 'stagingP', Game.flags.archerStaging4, {reusePath: 21, maxOps: 10000, heuristicWeight:1000, ignoreDestructibleStructures:false})
        if(creep.room == Game.flags.archerStaging4.room){
            creep.memory.staging4 = true;
        }
    }
    else
    {
        currentCPU = Game.cpu.getUsed();
        creep.say('flag');
        if(Game.flags.archerAttack != null){
            actionCachedMove(creep, 'destoryP', Game.flags.archerAttack, {reusePath: 21, maxOps: 10000, heuristicWeight:1000})
            creep.say('attack');
        }

        if(profile && Game.cpu.getUsed() - currentCPU > 5){
            console.log('After flag pathing ' + (Game.cpu.getUsed() - currentCPU));
        }
    }

    if(rangedattackrangedheal = ''){
        creep.rangedMassAttack();
    }


};
