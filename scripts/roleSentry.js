//defends the room
module.exports = {
  //move to rampart and shoot anything close enough
  defend: function (creep) {
    //var getMyRampart = require('getMyRampart');
    var actionCachedMove = require('actionCachedMove');
    var rampart = this.getMyRampart(creep);
    if(rampart != null){
        actionCachedMove(creep, 'rampartP', rampart);
    }
    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if(targets.length > 0){
        creep.rangedAttack(targets[0]);
        //creep.attack(target);
        creep.say('attack');
    }
    targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
    if(targets.length > 0){
        creep.attack(targets[0]);
        creep.say('attack');
    }
  },
  //find closest rampart with an enemy creep
  getMyRampart: function (creep){
    var memoryCreep = require('memoryCreep');
      var myRampart = Game.getObjectById(creep.memory.myRampart);
      var rampartCount = creep.memory.rampartCount;
      creep.memory.rampartCount = creep.memory.rampartCount + 1;
      if(myRampart != null && myRampart.pos.x == creep.pos.x && myRampart.pos.y == creep.pos.y && creep.memory.rampartCount < 20)
      {
          return myRampart;
      }
      //TODO shuffle to best rampart
      creep.say('Ramp');
  	if(myRampart == null || myRampart.pos.lookFor('creep').length > 0 || creep.memory.rampartCount >= 20){
  	    var hostile = memoryCreep.getMyHostile(creep);
  	    if(hostile != null){
  	        var ramparts = this.getRampartsByRange(hostile, 3);
  	        //console.log('Ramparts:' + ramparts.length);
              if(ramparts.length > 0){
                  var closestRampart = ramparts[0];
                  myRampart = ramparts[0];
                  for(var iRampart in ramparts)
                  {
                      //console.log('ClosestRampart:' + closestRampart);
                      var tempRampart = ramparts[iRampart];
                      if(hostile.pos.getRangeTo(tempRampart) < hostile.pos.getRangeTo(closestRampart)){
                          closestRampart = tempRampart;
                          myRampart = tempRampart;

                      }
                  }

              }
  	        //myRampart = findClosestRampart(hostile);
  	    }
  	    else{
      	    myRampart = this.findClosestRampart(creep);
  	    }
  	    if(myRampart != null){
      	    creep.memory.myRampart = myRampart.id;
      	    creep.memory.rampartCount = 0;
      	}
  	}
  	return myRampart;
  },

  findClosestRampart: function (object) {
      return object.pos.findInRange(FIND_STRUCTURES, { filter: function(i) {
          return i.structureType == STRUCTURE_RAMPART && i.pos.lookFor('creep') == 0;
      }});
  },

  getRampartsByRange: function (creep, range){
      return creep.pos.findInRange(FIND_STRUCTURES, range, { filter: function(i) {
          return i.structureType == STRUCTURE_RAMPART && i.pos.lookFor('creep') == 0;
      }});
  }
};
