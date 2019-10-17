//heals damaged creeps
module.exports = function (creep) {
    require('prototype.Creep');

    if(creep.hits < creep.hitsMax){
        creep.heal(creep);
        var target = creep.pos.findClosest(FIND_MY_SPAWNS);
        creep.moveTo(target);
        return;
    }
    for(var name in Game.creeps){
        var damagedCreep = Game.creeps[name];
        if(damagedCreep.hits < damagedCreep.hitsMax)
        {
            creep.moveTo(damagedCreep);
            creep.heal(damagedCreep);
            return;
        }
    }
    var structure = creep.findClosestDamagedStructure();
    //console.log(structure);
    //if(structure != null){
    //    creep.moveTo(structure);
    //    creep.heal(structure);
    //    return;
    //}

    var target = creep.findClosestGuard();
    creep.moveTo(target);
};
