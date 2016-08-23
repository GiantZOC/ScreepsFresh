module.exports = function (spawn, maxEnergy){
    var _ = require('lodash');
    var memoryCreep = require('memoryCreep');   
    var flagName;
    var flag;
    //var sources = this.GetMySources();
    for(var flagIterate = 1; flagIterate < 10; flagIterate++){
        flagName = 'KeeperFlag' + flagIterate;
        flag = Game.flags[flagName];
        //console.log('keeperFlag: ' + flag);
        if(flag != null && flag.memory.mySpawn == spawn.name){
            //var harvesters = _.filter(Game.creeps, { memory: {role: 'harvester'}
            var killers = _.filter(Game.creeps, {memory: {role:'keeperKiller', flag:flag.id}});
            //console.log('killers:' + killers);
            if(_.size(killers) < 3){
                if(maxEnergy >= 1900){
                    spawn.createCreep( [RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, HEAL, MOVE, HEAL, MOVE],  null, {role: 'keeperKiller', flag:flag.id, spawn:spawn.id});    
                    return true;
                }
            }
            /*
            var harvesters = _.filter(Game.creeps, {memory: role: 'harvester', flag:flag.id});
            if(_.size(harvesters) < 1){
                var body = [WORK, WORK, CARRY, MOVE, MOVE, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE];
                spawn.createCreep(body, , {role: 'harvester', spawn:spawn.id, flag:flag.id});
            }
            var deliverers = _.filter(Game.creeps, {memory: role: 'harvester', flag:flag.id});
            if(_.size(deliverers) < 5){
                spawn.createCreep(createBody(maxEnergy, 'Deliverer'), , {role: 'deliverer', spawn:spawn.id, flag:flag.id});
            }
            */
            
        }
    }
    return false;
};