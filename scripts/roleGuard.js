//defends the flag
module.exports = function (creep) {
    require('prototype.Creep')();
    var actionCachedMove = require('actionCachedMove');

    if(creep.getActiveBodyparts(HEAL) > 0){
        creep.getHealTarget();
    }
    var hostile = creep.getMyHostile();
    if(hostile != null){
        actionCachedMove(creep, 'attackP', hostile, {reusePath: 3})
        creep.attack(hostile);
        creep.say('Attack')
    }
    else{
        var flag = creep.getMyFlag();
        if(flag != null){
            if(creep.pos.getRangeTo(flag) < 3){
                var spawn = creep.getMySpawn();
                actionCachedMove(creep, 'spawnP', spawn);
            }
            else if(creep.pos.inRangeTo(flag, 5)){
                creep.cancelOrder('move');
            }
            else{
                actionCachedMove(creep, 'flagP', flag, {reusePath: 21, maxOps: 1000, heuristicWeight:1000})
            }
        }


        creep.say('Guard')
    }
};
