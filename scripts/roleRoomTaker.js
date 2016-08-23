module.exports = function (creep) {
    var goBuild = require('goBuild');
    var actionHarvest = require('actionHarvest');
    var getMyConstructionSite = require('getMyConstructionSite');
    var actionCachedMove = require('actionCachedMove');
    if(Game.flags.TakeStaging != null  && (creep.memory.staging == null || creep.memory.staging == false)){
        creep.say('Staging');
        actionCachedMove(creep, 'takeStagingP', Game.flags.TakeStaging, {reusePath: 21, maxOps: 10000});
        creep.moveTo();

        if(creep.room == Game.flags.TakeStaging.room){
            creep.memory.staging = true;
        }
    }
    else if(Game.flags.Take != null && creep.room != Game.flags.Take.room){
        creep.say('Flag');
        actionCachedMove(creep, 'takeP', Game.flags.Take, {reusePath: 21, maxOps: 10000});
        creep.moveTo();
    }
    else if(Game.flags.Unclaim != null)
    {
        if(creep.room != Game.flags.Unclaim.room){
            creep.say('UnclaimF');
            actionCachedMove(creep, 'unclaimP', Game.flags.Unclaim, {reusePath: 21, maxOps: 10000});
            creep.moveTo(Game.flags.Unclaim, {reusePath: 21, maxOps: 10000});
        }
        else{
            creep.say('Unclaim');
            actionCachedMove(creep, 'controlP', creep.room.controller);
            creep.unclaimController(creep.room.controller);
        }
    }
    else{
        if(creep.room.controller != null && creep.room.controller.my){
            if(creep.memory.action == 'harvest'){
                /*
                if(creep.room.memory.droppedEnergy != null && creep.room.memory.droppedEnergy.length > 0){
                    creep.say('scavenge');
                    console.log(creep.room.memory.droppedEnergy[0]);
                    creep.moveTo(creep.room.memory.droppedEnergy[0].pos);
                    creep.pickup(creep.room.memory.droppedEnergy[0].pos);
                }
                else{
                }
            */
                creep.say('harvest');
                actionHarvest(creep);

                if(creep.carry.energy == creep.carryCapacity){
	                creep.memory.action = 'deliver';
                    creep.say('deliver');
	            }
            }
            else{
                if(getMyConstructionSite(creep) != null) {
                    creep.say('Construction');
            	    var constructionSite = getMyConstructionSite(creep);
            	    //console.log('construction ' + constructionSite + ' pos' + constructionSite.pos);
            	    actionCachedMove(creep, 'constructP', constructionSite);
            	    creep.build(constructionSite);
            	    action = 'Construction';
            	}
                else{
                    actionCachedMove(creep, 'controlP', creep.room.controller);
                    creep.upgradeController(creep.room.controller);
                    creep.say('upgrade');
                }
            }

            if(creep.carry.energy == 0){
                creep.memory.action = 'harvest';
            }
        }
        else{
            actionCachedMove(creep, 'controlP', creep.room.controller);
            creep.claimController(creep.room.controller);
            creep.say('Claim');
        }

        if(Game.time % 25 == 5 && creep.room.controller != null && creep.room.controller.level > 3 && memory.getRoomSpawns(creep.room).length > 0){
            creep.memory.role = 'builder';
        }
    }
};
