module.exports = function (creep) {
    require('prototype.Creep')();

    if(creep.getActiveBodyparts(HEAL) > 0){
        creep.getHealTarget();
        creep.say('heal');
    }
    var flag = creep.getMyFlag();
    //console.log('Creep: ' + creep.name + ' Flag:' + flag);
    var hostile = creep.getMyKeeper();
    if(hostile != null){
        var range = creep.pos.getRangeTo(hostile);
        if(range > 3){
            if(creep.hitsMax == creep.hits){
                creep.moveTo(hostile);
                creep.say('engage');
            }
        }
        if(range < 2 ){
            creep.getRetreatPath(hostile);
        }
        if(range < 4){
            creep.rangedAttack(hostile);
            creep.say('Attack');

            if(creep.hitsMax/2 > creep.hits){
                creep.getRetreatPath(hostile);
                creep.say('Retreat');
            }
        }
    }
    else if(flag != null){
        creep.moveTo(flag, {reusePath: 20, maxOps: 10000});
        creep.say('flag');
    }
};
