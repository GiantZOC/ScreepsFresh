module.exports = function () {
    Creep.prototype.customPathFinder = function (target, range, opts) {
      /*
      let goals = _.map(creep.room.find(FIND_SOURCES), function (source) {

        // We can't actually walk on sources-- set `range` to 1 so we path
        // next to it.
        return {
          pos: source.pos,
          range: 1
        };
      });
      */
      //var goal = {pos:target, range:range};
      //var path = this.pathAvoidHostiles(goal, opts);
      //console.log('Path: ' + path);

      /*
      var path = this.memory.customPath;
      if(this.memory.pathSaved == null || this.memory.pathTime == null || this.memory.pathUseTime == null || this.memory.pathTime > this.memory.pathUseTime){
        //get new path
        console.log('NewPath ' + this.name);
        //var goals = [];

        //goals.push(goal);


        //this.moveByPath(path);
        this.memory.pathUseTime = 20;
        this.memory.pathTime = 0;
        this.memory.pathSaved = path.path;


      } else{
        console.log('OldPath ' + this.name);
        this.memory.pathTime = this.memory.pathTime + 1;
        //var path = [];
        //path = this.memory.path;
        console.log('Saved: ' + this.memory.pathSaved);
        this.customMoveByPath(this.memory.pathSaved);
      }
      return true;
*/
      //var pos = ret.path[0];
      //console.log('ret: ' + ret);
      //this.move(this.pos.getDirectionTo(pos));
    },

  Creep.prototype.pathAvoidHostiles = function(goal, opts){
    require('prototype.Room.memory')();

    // Use `findRoute` to calculate a high-level plan for this path,
    // prioritizing highways and owned rooms

    let allowedRooms = { [ this.room.name]: true };
    //var route =
    var route = Game.map.findRoute(this.room.name, goal.pos.roomName, {
      routeCallback(roomName) {
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
        let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
        let isMyRoom = Game.rooms[roomName] &&
          Game.rooms[roomName].controller &&
          Game.rooms[roomName].controller.my;
        if (isHighway || isMyRoom) {
          return 1;
        } else {
          return 2.5;
        }
      }
    }).forEach(function(info) {
      allowedRooms[info.room] = true;
    });

    route = Game.map.findRoute(this.room.name, goal.pos.roomName, {
      routeCallback(roomName) {
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
        let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
        let isMyRoom = Game.rooms[roomName] &&
          Game.rooms[roomName].controller &&
          Game.rooms[roomName].controller.my;
        if (isHighway || isMyRoom) {
          return 1;
        } else {
          return 2.5;
        }
      }
    });



    console.log('allowedRooms: ' + allowedRooms + ' ' + allowedRooms.length + allowedRooms[0]);

    this.memory.allowedRooms = allowedRooms;
    this.memory.route = route;
    console.log('goal: ' + goal.pos + ' ' + goal.pos.roomName);


    //console.log('Route: ' + route);
    //for(var i = 0; i < allowedRooms.length; i++){
      //var room = allowedRooms[i];
      //console.log('Room: ' + room.room);
    //}
    //if(route == null){
      //return null;
    //}
    var ret = PathFinder.search(
      this.pos, goal, {
        // We need to set the defaults costs higher so that we
        // can set the road cost lower in `roomCallback`
        plainCost: 2,
        swampCost: 10,

        roomCallback: function (roomName) {
          let room = allowedRooms[roomName];
          console.log('Room: ' + room);
          if (allowedRooms[roomName] === undefined) {
      			return false;
      		}
          room = Game.rooms[roomName];
          // In this example `room` will always exist, but since PathFinder
          // supports searches which span multiple rooms you should be careful!
          if (!room) return;
          return room.getCostMatrix();
          /*
          let costs = new PathFinder.CostMatrix;

          room.find(FIND_STRUCTURES).forEach(function (structure) {
            if (structure.structureType === STRUCTURE_ROAD) {
              // Favor roads over plain tiles
              costs.set(structure.pos.x, structure.pos.y, 1);
            } else if (structure.structureType !== STRUCTURE_CONTAINER &&
              (structure.structureType !== STRUCTURE_RAMPART ||
                !structure.my)) {
              // Can't walk through non-walkable buildings
              costs.set(structure.pos.x, structure.pos.y, 0xff);
            }
          });

          // Avoid creeps in the room
          room.find(FIND_CREEPS).forEach(function (creep) {
            costs.set(creep.pos.x, creep.pos.y, 0xff);
          });

          // Avoid creeps in the room
          room.find(FIND_HOSTILE_CREEPS).forEach(function (creep) {
            for(var x = -3; x <= 3; x++){
              for(var y = -3; y <= 3; y++){
                costs.set(creep.pos.x + x, creep.pos.y + y, 0xff);
              }
            }
          });
          return costs;
          */
        },
      }
    );
    //if(ret.length < 1){
    //  return null;
    //}
    return ret;
  },

  Creep.prototype.customMoveByPath = function(path){
    var result = this.moveByPath(path);
    //console.log('moveByPath: ' + path);
    console.log('Result: ' + result);
    if(result == 0){
      return true;
    }
    else if(result == -1){
      return false;
    }
    else if(result == -4){
      return true;
    }
    else if(result == -5){
      return true;
    }
    else if(result == -10){
      return false;
    }
    else if(result == -11){
      return true;
    }
    else if(result == -12){
      return true;
    }
    return false;
  },
  Creep.prototype.customMove = function(target, opts){
    var result = this.moveTo(target);
    console.log('Result: ' + result + ' target: ' + target);
    if(result == 0){
      return true;
    }
    else if(result == -1){
      return false;
    }
    else if(result == -4){
      return true;
    }
    else if(result == -11){
      return true;
    }
    else if(result == -12){
      return true;
    }
    else if(result == -7){
      return false;
    }
    else if(result == -2){
      return false;
    }
    return false;
  },
  //Currently unused
  Creep.prototype.findCreepByRole = function (targetRole) {
      var target = Game.getObjectById(this.memory.targetCreep);
      if (target == null) {
        target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: function (i) {
            return i.memory.role == targetRole;
          }
        });
        //console.log(target);
        if (target != null) {
          this.memory.targetCreep = target.id;
        }
      }
      return target;
    },

    Creep.prototype.getMySpawn = function () {
      var spawn = Game.getObjectById(this.memory.spawn);
      if (spawn == null) {
        spawn = this.pos.findClosestByPath(FIND_MY_SPAWNS);
        if (spawn != null) {
          this.memory.spawn = spawn.id;
        }
      }
      return spawn;
    },
    Creep.prototype.getMyFlag = function () {
      var flag = Game.flags[this.memory.flag];
      if (flag == null) {
        flag = this.pos.findClosestByPath(FIND_FLAGS, {
          filter: {
            memory: {
              type: 'source'
            }
          }
        });
        this.memory.flag = flag.name;
      }
      return flag;
    },
    Creep.prototype.getMyRoom = function () {
      var room = Game.rooms[this.memory.myRoom];
      if (room == null) {
        room = this.room;
        if (room != null) {
          this.memory.myRoom = room.name;
        }
      }
      return room;
    },
    Creep.prototype.getHarvesterWithSameFlag = function () {
      var myTarget = Game.getObjectById(this.memory.myHarvester);
      if (myTarget == null) { //|| myTarget.carry.energy < 15
        var myBuddys = _.filter(Game.creeps, {
          memory: {
            role: 'harvester',
            flag: this.memory.flag
          }
        });
        if (_.size(myBuddys) > 0) {
          myTarget = myBuddys[0];
          this.memory.myHarvester = myBuddys[0].id;
        }
      }
      return myTarget;
    },

    Creep.prototype.findClosestEnergyStorage = function () {
      return this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function (i) {
          return ((i.structureType == STRUCTURE_EXTENSION && i.energy < i.energyCapacity && i.my) ||
            (i.structureType == STRUCTURE_LINK && i.energy < i.energyCapacity && i.my) ||
            (i.structureType == STRUCTURE_STORAGE && i.store.energy < i.storeCapacity && i.my)
          ); //(i.structureType == STRUCTURE_SPAWN && i.energy < i.energyCapacity)
        },
        maxOps: 1000
      });
    },
    Creep.prototype.findClosestStorage = function () {
      var myLink = null;
      if (this.room.memory.hasLink != null && this.room.memory.hasLink) {
        myLink = this.getMyLink();
      }
      if (myLink != null && myLink.energy > 0) {
        //console.log('findClosestStorage myLink ' + this.name);
        return myLink;
      } else if (this.room.storage != null && this.room.storage.my && this.room.storage.store.energy > 0) {
        //console.log('findClosestStorage storage ' + this.name);
        return this.room.storage;
      } else {
        var mySpawn = this.getMySpawn();
        if (mySpawn != null) {
          return mySpawn;
        }
      }
    },
    Creep.prototype.getMyLink = function () {
      require('prototype.RoomPosition')();
      var link = Game.getObjectById(this.memory.link);
      if (link == null) {
        link = this.pos.findClosestStructureByType(STRUCTURE_LINK);
        if (link != null) {
          this.memory.link = link.id;
        }
      }
      return link;
    },
    //TODO cleanup this code, old hack for mining from different room
    Creep.prototype.getMyRemoteSource = function () {
      require('prototype.RoomPosition')();
      var source = Game.getObjectById(this.memory.source);
      if (source == null) {
        var myFlag = this.getMyFlag();
        if (myFlag != null) {
          if (this.room == myFlag.room) {
            source = myFlag.pos.lookFor('source');
            //console.log('new source found:' + source[0]);
            if (source.length && source[0] != null) {
              this.memory.source = source[0].id;
            }
          }
        } else {
          source = this.pos.getClosestStructureByType(STRUCTURE_SOURCE);
        }
      }
      return source;
    },
    Creep.prototype.getMyStore = function () {
      var myStore = Game.getObjectById(this.memory.store);
      if (myStore == null) {
        //console.log('New Store: Cached value was null');
        myStore = this.getNewStore();
      } else {
        if ((myStore.structureType == STRUCTURE_STORAGE && myStore.store.energy == myStore.storeCapacity) ||
          ((myStore.structureType == STRUCTURE_EXTENSION ||
              myStore.structureType == STRUCTURE_LINK ||
              myStore.structureType == STRUCTURE_SPAWN) &&
            myStore.energy == myStore.energyCapacity)) {
          //console.log('New Store: Cached storage was full');
          myStore = this.getNewStore()
        }
      }
      return myStore;
    },

    Creep.prototype.getNewStore = function () {
      var myStore = this.room.storage;

      if (myStore == null) {
        myStore = this.getMySpawn();
      }
      if (myStore != null) {
        this.memory.store = myStore.id;
      }
      return myStore;
    },

    //TODO: check damagedCreepLogic
    Creep.prototype.getHealTarget = function () {
      if (this.room.memory.damagedCreep != null && this.room.memory.damagedCreep) {
        myHealTarget = this.getMyDamagedCreep();
        if (myHealTarget != null) {
          var range = this.pos.getRangeTo(myHealTarget);
          this.say('H:' + myHealTarget.name);
          if (range < 2) {
            this.heal(myHealTarget);
          } else {
            this.rangedHeal(myHealTarget);
          }
          return true;
        }
      }
      return false;
    },
    Creep.prototype.getMyDamagedCreep = function () {
      var myDamaged = Game.getObjectById(this.memory.myDamaged);
      if (myDamaged == null || myDamaged.hits == myDamaged.hitsMax || this.pos.getRangeTo(myDamaged) > 3) {
        myDamaged = this.pos.findInRange(FIND_MY_CREEPS, 3, {
          filter: function (i) {
            return i.hits < i.hitsMax;
          }
        }); //findClosestDamagedCreep();
        if (myDamaged.length > 0) {
          this.memory.myDamaged = myDamaged[0].id;
        }
      }
      return myDamaged;
    },
    //TODO fix hack for killing spawns
    Creep.prototype.getHostileSpawn = function (blocked) {
      var spawn = Game.getObjectById(this.memory['hostileSpawn' + blocked]);

      if (spawn == null || spawn.hits == 0) {
        //

        if (Game.time % 10 == 3) {
          spawn = this.pos.findClosestByPath(FIND_HOSTILE_SPAWNS, {
            ignoreDestructibleStructures: blocked,
            maxOps: 100
          });
          if (spawn != null) {
            this.memory['hostileSpawn' + blocked] = spawn.id;
          }
        }
      }
      return spawn;
    },

    Creep.prototype.getHostileTarget = function (bRetreat, bAttack) {
      var actionCachedMove = require('actionCachedMove');
      if (Game.flags.Pacifism1 != null && this.room == Game.flags.Pacifism1.room) {
        return false;
      }
      var hostile = this.getMyHostile();
      if (hostile != null) {
        currentCPU = Game.cpu.getUsed()
        this.say('eCreep');
        var target = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
          maxOps: 500
        });
        if (target == null) {
          var targets = this.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
          if (targets.length > 0) {
            target = targets[0];
          }
        }

        if (target != null) {
          /*
          var hasRampart = false;
          var enemyStructures = creep.room.lookForAt('structure', target);
          if(enemyStructures.length > 0){
              for(var enemyStructure in enemyStructures)
              {
                  var structure = enemyStructures[enemyStructure];
                  if(structure.structureType == 'STRUCTURE_RAMPART'){
                      return false;
                  }

          }
          */

          var range = this.pos.getRangeTo(target);
          if (this.getActiveBodyparts(RANGED_ATTACK) > 0) {
            if (range > 3 && bAttack) {
              actionCachedMove(this, 'targetP', target);
              this.moveTo(target);
            }
            if (range == 3) {
              this.say('RangedAttack');
              this.rangedAttack(target);
              return;
            }
            if (range == 2) {
              this.say('RangedAttack');
              this.rangedAttack(target);
              //getRetreatPath(creep, target);
            }
            if (range == 1) {
              this.say('RangedAttack');
              this.rangedAttack(target);

              if (this.getActiveBodyparts(ATTACK) > 0) {
                this.say('MeleeAttack');
                this.attack(target);
              } else {
                this.getRetreatPath(target);
              }
            }
          }
          if (this.hits < this.hitsMax - 200 && range < 5) {
            this.say('Retreat');
            this.getRetreatPath(target);
          }
          if (bRetreat) {
            if (Game.flags.archerRetreat != null) {
              this.cancelOrder('move');
              this.moveTo(Game.flags.archerRetreat);
              this.say('archRetreat');
            }
          }
          return true;
        }
        //if(Game.cpu.getUsed() - currentCPU > 5){
        //    console.log('Hostile ' + (Game.cpu.getUsed() - currentCPU));
        //}
      }
      return false;
    },
    Creep.prototype.getMyHostile = function () {
      var hostile = Game.getObjectById(this.memory.hostile);
      if (this.room.enemyCount == 0) {
        return null;
      }
      if ((hostile == null || hostile.hits == 0 || this.memory.hostileFindAttempt > Game.time + 5) && this.room.memory.enemyCount > 0) {
        hostile = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
          ignoreCreeps: true
        });
        this.memory.hostileFindAttempt = Game.time;

        if (hostile != null) {
          this.memory.hostile = hostile.id;
        }
      }
      return hostile;
    },

    Creep.prototype.getMyKeeper = function () {
      var myKeeper = Game.getObjectById(this.memory.myKeeper);
      if ((myKeeper == null || this.pos.getRangeTo(myKeeper) > 10 || myKeeper.hits == 0) && this.room.memory.enemyCount > 0) {
        myKeeper = this.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
        if (myKeeper.length > 0) {
          this.memory.myKeeper = myKeeper[0].id;
        }
      }
      return myKeeper;
    },
    //TODO: needs performance improvements
    Creep.prototype.getCloseDeliverer = function () {
      var deliverer = null;
      if (this.memory.closeDeliverer != null) {
        deliverer = Game.getObjectById(this.memory.closeDeliverer);
      }
      if (deliverer == null || !this.pos.inRangeTo(deliverer, 1)) {
        this.memory.closeDeliverer = null;
        var deliverers = this.pos.findInRange(this.getMyDeliverers(), 1, {
          filter: function (i) {
            return (i.memory.role == 'deliverer' && i.memory.flag == this.memory.flag);
          }
        });

        if (deliverers != null && deliverers.length > 0) {
          deliverer = deliverers[0];
          this.memory.closeDeliverer = deliverers[0].id;
        }
      }
      return deliverer;
    },
    Creep.prototype.getMyDeliverers = function () {
      require('prototype.Room.memory');
      var deliverers = this.memory.deliverers;
      //TODO: better cache strategy
      //if(deliverers == null){
      var creeps = this.room.getCreeps();
      var deliverers = [];
      for(var i = 0; i< creeps.length; i++){
        var creep = creeps[i];
        //console.log(creep.name);
        //console.log(creep.memory.role);
        //console.log(creep.memory.flag);
        if(creep != null && creep.memory != null && creep.memory.role == 'deliverer' && creep.memory.flag != null && creep.memory.flag == this.memory.flag){
          deliverers.push(creep);
        }
      }
      /*
      var deliverers = _.filter(creeps, function (o) {
        return o != null && o.memory != null && o.memory.role == 'deliverer' && o.memory.flag != null && o.memory.flag == this.memory.flag;
      });
      */

      //console.log('deliverers: ' + deliverers);
      if (deliverers.length > 0) {
        this.memory.deliverers = deliverers;
      }
      //}
      return deliverers;
    },
    Creep.prototype.getMyEnemyStructure = function () {
      var eStructure = Game.getObjectById(this.memory.eStructure);
      //console.log('Enemy Structure: ' + eStructure);
      if (eStructure == null || eStructure.hits == 0 || Game.time % 10 == 0) {
        eStructure = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
        //console.log(hostile);
        if (eStructure.length > 0 && eStructure[0] != null) {
          //console.log('Structure Found?' + eStructure[0]);
          this.memory.eStructure = eStructure[0].id;
        } else {
          this.memory.eStructure = null;
        }
      }
      return eStructure;
    },
    Creep.prototype.getMyNeutralStructure = function () {
      var nStructure = Game.getObjectById(this.memory.nStructure);
      //console.log('Enemy Structure: ' + eStructure);
      if (nStructure == null || nStructure.hits == 0) {
        nStructure = this.pos.findInRange(FIND_STRUCTURES, 3);
        //console.log(hostile);
        if (nStructure.length > 0 && nStructure[0] != null) {
          this.memory.nStructure = nStructure[0].id;
        }
      }
      return nStructure;
    },
    Creep.prototype.getMyTargetCreep = function () {
      var myTarget = Game.getObjectById(this.memory.myTarget);
      if (myTarget == null) {
        myTargets = _.filter(Game.creeps, {
          memory: {
            role: this.memory.targetRole
          }
        });

        if (_.size(myTargets) > 0) {
          myTarget = myTargets[0];
          this.memory.myTarget = myTargets[0].id;
        }
      }
      return myTarget;
    },
    Creep.prototype.getMyDeliverer = function () {
      var myDeliverer = Game.getObjectById(this.memory.myDeliverer);
      if (myDeliverer == null) {
        var myDeliverer = _.find(Game.creeps, function (creep) {
          return creep.memory.myTarget == this.id;
        });
        this.memory.myDeliverer = myDeliverer;
      }
      return myDeliverer;
    },

    Creep.prototype.getMyTargetDeliverer = function () {
      require('prototype.Room.memory')();
      var myDeliverer = Game.getObjectById(this.memory.myTargetDeliverer);
      if (myDeliverer == null) {
        var myDeliverer = _.find(this.room.getCreeps(), function (creep) {
          return creep.memory.myTarget == this.id;
        });
        this.memory.myDeliverer = myDeliverer;
      }
      return myDeliverer;
    },
    Creep.prototype.getMyTower = function () {
      var myTower = Game.getObjectById(this.memory.tower);
      if (myTower == null || myTower.energy == myTower.energyCapacity) {
        //TODO: delivery problem for extensions
        var tower = this.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: function (i) {
            return i.structureType == STRUCTURE_TOWER && i.energy < i.energyCapacity;
          }
        });
        if (tower != null) {
          this.memory.tower = tower.id;
          myTower = tower;
        } else {
          return null;
        }
      }
      return myTower;
    },
    Creep.prototype.getMyExtension = function () {
      var myExtension = Game.getObjectById(this.memory.extension);
      if (myExtension == null || myExtension.energy == myExtension.energyCapacity) {
        //TODO: delivery problem for extensions
        var extension = this.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: function (i) {
            return i.structureType == STRUCTURE_EXTENSION && i.energy < i.energyCapacity;
          }
        });
        if (extension != null) {
          this.memory.extension = extension.id;
          myExtension = extension;
        } else {
          return null;
        }
      }
      return myExtension;
    },
    Creep.prototype.getRetreatPath = function (target) {
      var direction = this.pos.getDirectionTo(target);
      var oppositeDirection = null;
      if (direction == 1) {
        oppositeDirection = 5;
      } else if (direction == 2) {
        oppositeDirection = 6;
      } else if (direction == 3) {
        oppositeDirection = 7;
      } else if (direction == 4) {
        oppositeDirection = 8;
      } else if (direction == 5) {
        oppositeDirection = 1;
      } else if (direction == 6) {
        oppositeDirection = 2;
      } else if (direction == 7) {
        oppositeDirection = 3;
      } else if (direction == 8) {
        oppositeDirection = 4;
      }
      this.move(oppositeDirection);
    },
    Creep.prototype.waiting = function () {
      var myStore = this.getMyStore();
      if ((myStore.structureType == STRUCTURE_EXTENSION || myStore.structureType == STRUCTURE_SPAWN) && myStore.energy == myStore.energyCapacity) {
        return true;
      } else {
        return false;
      }
    },

    Creep.prototype.getCreepByRole = function (targetRole) {
      var target = Game.getObjectById(this.memory.targetCreep);
      if (target == null) {
        target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: function (i) {
            return i.memory.role == targetRole;
          }
        });
        //console.log(target);
        if (target != null) {
          this.memory.targetCreep = target.id;
        }
      }
      return target;
    },
    Creep.prototype.takeMyStorageEnergy = function () {
      var myStorage = this.getMyStore();
      var storeEnergy;
      if (myStorage.structureType == STRUCTURE_STORAGE) {
        storeEnergy = myStorage.store;
      } else {
        storeEnergy = myStorage.energy;
      }
      //calculate how much energy to give creep
      var transfer = (this.carryCapacity - this.carry.energy);
      if (transfer > myStorage.energy) {
        transfer = myStorage.energy;
      }

      if (myStorage.structureType == STRUCTURE_SPAWN) {
        myStorage.transferEnergy(this, transfer);
      } else {
        myStorage.transfer(this, RESOURCE_ENERGY, transfer);
      }
    };
};
