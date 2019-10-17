//logic for creating creeps in a room
module.exports = function () {
  Room.prototype.createCreeps = function () {
      require('prototype.Room.memory');
      require('prototype.Flag');
      require('prototype.Spawn');

      var sources = this.getSources();
      var spawns = this.getSpawns();
      var minerals = this.getMinerals();

      var controller = this.controller;

      //TODO: military
      //var attackParts = memory.getAttackParts(room) + memory.getRangedAttackParts(room);
      //var defended = memory.getRoomDefended(room);
      var creeps = this.getCreeps();
      var extensions = this.getExtensions();
      var creepQueue = this.getCreepQueue();
      var buildTime = 0;

      //create creeps in priority order
      this.manageHarvesting(creeps, creepQueue);
      this.createMovers(creeps, extensions.length);
      this.createUpgraders(creeps);
      this.createTargetDeliverers(creeps, 'upgrader');
      this.createBuilders(creeps);
      this.createTargetDeliverers(creeps, 'builder');
      this.createScout();
      this.spawnQueuedCreeps(spawns);

    },
    Room.prototype.manageHarvesting = function (creeps) {
      var creepQueue = this.getCreepQueue();
      var flags = this.getSourceFlags();
      var roomHarvesters = _.filter(creeps, function (creep) {
        return creep.memory.role == 'harvester';
      });

      var queuedharvesters = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'harvester' && creep.memory.priority == 1;
      });

      var getHarvestersStarted = false;
      if (roomHarvesters.length < 1 && queuedharvesters.length < 1) {
        getHarvestersStarted = true;
      }

      for (var flagIterate = 0; flagIterate < flags.length; flagIterate++) {
        var flag = flags[flagIterate];

        var openSpaces = flag.getOpenSpaces();
        var spawn = flag.getSpawn();

        if (spawn != null) {
          //var spawnPathCost = memory.getFlagSpawnPathCost(flag);
          var myCreeps = _.filter(Game.creeps, function (creep) {
            return creep.memory.flag == flag.name;
          });

          var myCreepQueue = _.filter(creepQueue, function (creep) {
            return creep.memory.flag == flag.name;
          });

          var flagHasContainer = false; //TODO: containers
          //harvester stuff
          if (getHarvestersStarted) {
            var harvesterBody = this.harvesterBody(200, 1, flagHasContainer);
            var creep = {
              body: harvesterBody,
              memory: {
                role: 'harvester',
                flag: flag.name,
                spawn: spawn.id,
                priority: 1
              }
            };
            this.addCreep(creep);
            getHarvestersStarted = false;
          }

          var targetHarvesterWorkParts = 5;
          this.createHarvesters(myCreeps, myCreepQueue, targetHarvesterWorkParts, openSpaces, flagHasContainer, flag, spawn);

          //deliverer stuff
          //var energyPerSecond = currentHarvesterWorkParts * 2; //typically 10
          //TODO: fix spawnPathCost first
          //var targetCarryParts = Math.ceil(energyPerSecond * spawnPathCost * 2 /50); //10e/t = targetCarryParts*50e/spawnPathCost*2
          var targetCarryParts = 9;
          this.createDeliverers(myCreeps, myCreepQueue, targetCarryParts, flag, spawn);
        }
      }
    },
    Room.prototype.spawnQueuedCreeps = function (spawns) {
      require('prototype.Spawn');
      var creepQueue = this.getCreepQueue();
      var spawnCreepQueue = _.filter(creepQueue, function (creep) {
        return creep.memory.spawning == null || creep.memory.spawning == false;
      });

      for (var i = 0; i < spawns.length; i++) {
        var spawn = spawns[i];
        if (!spawn.spawning) {
          var newCreep = spawnCreepQueue[0];
          if (newCreep != null) {
            var canCreateCreep = spawn.customCanCreateCreep(newCreep.body);
            console.log('spawnAttempt role: ' + newCreep.memory.role + ' body: ' + newCreep.body + ' canCreateCreep:' + canCreateCreep);

            if (canCreateCreep == true) {
              spawnCreepQueue[0].memory.spawning = true;
              spawnCreepQueue[0].memory.timeSpawned = Game.time + spawnCreepQueue[0].body.length * CREEP_SPAWN_TIME;
              spawn.createCreep(newCreep.body, null, newCreep.memory);
              //creepQueue.splice(0, 1);
              spawn.memory.hordeEnergy = false;
            } else if (canCreateCreep == 'ERR_NOT_ENOUGH_ENERGY') {
              spawn.memory.hordeEnergy = true;
            } else if (canCreateCreep == 'ERR_INVALID_ARGS' || canCreateCreep == 'ERR_RCL_NOT_ENOUGH' || canCreateCreep == 'ERR_NOT_OWNER' || canCreateCreep == 'ERR_NAME_EXISTS') {
              creepQueue.splice(0, 1);
              throw canCreateCreep + newCreep.body;
            }
          }
        }
      }

      //remove spawned creeps from queue
      var spawningCreepQueue = _.filter(creepQueue, function (creep) {
        return creep.memory.spawning == true;
      });
      var spawningCreep;
      for (var i = 0; i < spawningCreepQueue.length; i++) {
        var spawningCreep = spawningCreepQueue[i];
        if (Game.time >= spawningCreep.memory.timeSpawned) {
          var index = creepQueue.indexOf(spawningCreep);
          creepQueue.splice(index, 1);
        }
      }

      this.setCreepQueue(creepQueue);
    },

    Room.prototype.getCreepQueue = function () {
      var creepQueue = this.memory.creepQueue;
      if (creepQueue == null) {
        creepQueue = [];
      }
      return creepQueue;
    },

    Room.prototype.setCreepQueue = function (creepQueue) {
      this.memory.creepQueue = creepQueue;
    },
    Room.prototype.addCreep = function (creep) {
      var creepQueue = this.getCreepQueue();
      creepQueue.push(creep);
      creepQueue = _.sortBy(creepQueue, function (o) {
        return o.memory.priority
      });
      this.setCreepQueue(creepQueue);
    },
    Room.prototype.createUpgraders = function (creeps) {
      var creepQueue = this.getCreepQueue();
      var myUpgraders = _.filter(creeps, function (creep) {
        return creep.memory.role == 'upgrader';
      });

      var queuedUpgraders = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'upgrader';
      });
      var hasContainer = false;

      if (myUpgraders.length + queuedUpgraders.length < 1) {
        var upgraderBody = this.upgraderBody(hasContainer);
        var creep = {
          body: upgraderBody,
          memory: {
            role: 'upgrader',
            priority: 40
          }
        };
        this.addCreep(creep);
      }
    },
    Room.prototype.createTargetDeliverers = function (creeps, targetRole) {

      var creepQueue = this.getCreepQueue();
      var myTargets = _.filter(creeps, function (creep) {
        return creep.memory.role == targetRole;
      });

      var queuedTargets = _.filter(creepQueue, function (creep) {
        return creep.memory.role == targetRole;
      });

      var myTargetDeliverers = _.filter(creeps, function (creep) {
        return creep.memory.role == 'targetDeliverer' && creep.memory.targetRole == targetRole;
      });

      var queuedTargetDeliverers = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'targetDeliverer' && creep.memory.targetRole == targetRole;
      });
      //console.log('Targets: ' + myTargets + 'queuedTargets: ' + queuedTargets + ' myTargetDeliverers: ' + myTargetDeliverers + ' queuedTargetDeliverers: ' + queuedTargetDeliverers);
      //TODO: calculate how many to make
      if ((myTargets.length + queuedTargets.length) > 1 && (myTargetDeliverers.length + queuedTargetDeliverers.length) < 3) {
        var targetDelivererBody = this.targetDelivererBody(3); //TODO: remove part hardcoding
        var creep = {
          body: targetDelivererBody,
          memory: {
            role: 'targetDeliverer',
            targetRole: targetRole,
            priority: 40
          }
        };
        this.addCreep(creep);

      }
    },

    Room.prototype.createBuilders = function (creeps) {
      var creepQueue = this.getCreepQueue();
      var myBuilders = _.filter(creeps, function (creep) {
        return creep.memory.role == 'builder';
      });

      var queuedBuilders = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'builder';
      });
      var hasContainer = false;

      if (myBuilders.length + queuedBuilders.length < 1) {
        var builderBody = this.builderBody();
        var creep = {
          body: builderBody,
          memory: {
            role: 'builder',
            priority: 50
          }
        };
        this.addCreep(creep);
      }
    },
    Room.prototype.createHarvesters = function (myCreeps, creepQueue, targetHarvesterWorkParts, openSpaces, flagHasContainer, flag, spawn) {
      var maxEnergy = spawn.room.energyCapacityAvailable;
      var currentHarvesterWorkParts = 0;
      //var harvesterCount = 0;

      var myHarvesters = _.filter(myCreeps, function (creep) {
        return creep.memory.role == 'harvester';
      });

      var queuedHarvesters = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'harvester';
      });

      for (var i = 0; i < myHarvesters.length; i++) {
        var harvester = myHarvesters[i];
        currentHarvesterWorkParts += this.partCounter(harvester.body, WORK);
      }
      for (var i = 0; i < queuedHarvesters.length; i++) {
        var harvester = queuedHarvesters[i];
        currentHarvesterWorkParts += this.partCounter(harvester.body, WORK);
      }
      var remainingOpenSpaces = openSpaces - myHarvesters.length - queuedHarvesters.length;
      //console.log('workparts: ' + currentHarvesterWorkParts);
      if (currentHarvesterWorkParts < targetHarvesterWorkParts) {
        var remainingHarvesterWorkParts = targetHarvesterWorkParts - currentHarvesterWorkParts;
        for (var spaceIterate = 0; spaceIterate < remainingOpenSpaces; spaceIterate++) {
          remainingHarvesterWorkParts = targetHarvesterWorkParts - currentHarvesterWorkParts;
          var harvesterBody = this.harvesterBody(maxEnergy, remainingHarvesterWorkParts, flagHasContainer);
          var harvesterBodyCost = this.bodyCalculator(harvesterBody);
          var harvesterWorkParts = this.partCounter(harvesterBody, WORK);

          currentHarvesterWorkParts += harvesterWorkParts;
          //currentEnergyUsed += harvesterBodyCost;
          //harvesterCount++;
          var creep = {
            body: harvesterBody,
            memory: {
              role: 'harvester',
              flag: flag.name,
              spawn: spawn.id,
              priority: 20,
              respawnTimer: harvesterBody.length * CREEP_SPAWN_TIME
            }
          };
          this.addCreep(creep);
          //creepQueue.push(creep);
          if (currentHarvesterWorkParts >= targetHarvesterWorkParts) {
            break;
          }
        }
      }
    },
    Room.prototype.createMovers = function (creeps, extensionsLength) {
      var creepQueue = this.getCreepQueue();
      var queuedMovers = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'mover';
      });

      var movers = _.filter(creeps, function (creep) {
        return creep.memory.role == 'mover';
      });

      if ((movers.length + queuedMovers.length) < 1) {
        //mover stuff
        var carryParts = Math.round(extensionsLength / 4) + 3;
        var carryBody = this.moverBody(3);

        var creep = {
          body: carryBody,
          memory: {
            role: 'mover',
            priority: 10,
            respawnTimer: carryBody.length * CREEP_SPAWN_TIME
          }
        };
        this.addCreep(creep);
        //creepQueue.push(creep);
      }

      if ((movers.length + queuedMovers.length) == 1) {
        //mover stuff
        var carryParts = Math.round(extensionsLength / 8) + 3;
        var carryBody = this.moverBody(carryParts);

        var creep = {
          body: carryBody,
          memory: {
            role: 'mover',
            priority: 11,
            respawnTimer: carryBody.length * CREEP_SPAWN_TIME
          }
        };
        this.addCreep(creep);
        //creepQueue.push(creep);
      }
    },
    Room.prototype.countDelivererCarryParts = function (myCreeps, creepQueue) {
      var currentCarryParts = 0;
      var myDeliverers = _.filter(myCreeps, function (creep) {
        return creep.memory.role == 'deliverer';
      });

      for (var i = 0; i < myDeliverers.length; i++) {
        var deliverer = myDeliverers[i];
        currentCarryParts += this.partCounter(deliverer.body, CARRY);
      }

      var queuedDeliverers = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'deliverer';
      });

      for (var i = 0; i < queuedDeliverers.length; i++) {
        var deliverer = queuedDeliverers[i];
        currentCarryParts += this.partCounter(deliverer.body, CARRY);
      }
      return currentCarryParts;
    },
    Room.prototype.createDeliverers = function (myCreeps, creepQueue, targetCarryParts, flag, spawn) {
      var maxEnergy = spawn.room.energyCapacityAvailable;
      var currentCarryParts = this.countDelivererCarryParts(myCreeps, creepQueue);
      var remainingCarryParts = targetCarryParts - currentCarryParts;
      var hasContainer = flag.getContainer() != null;
      //var energyUsed = 0;
      while (remainingCarryParts > 0) {
        var delivererBody = this.delivererBody(maxEnergy, remainingCarryParts, hasContainer);
        var delivererBodyCost = this.bodyCalculator(delivererBody);
        var carryParts = this.partCounter(delivererBody, CARRY);
        remainingCarryParts -= carryParts;
        //energyUsed += delivererBodyCost;
        var creep = {
          body: delivererBody,
          memory: {
            role: 'deliverer',
            flag: flag.name,
            spawn: spawn.id,
            priority: 30,
            respawnTimer: delivererBody.length * CREEP_SPAWN_TIME
          }
        };
        this.addCreep(creep);
        //creepQueue.push(creep);

        //return energyUsed;
      }
    },

    Room.prototype.createScout = function (creeps) {
      var creepQueue = this.getCreepQueue();
      var myScouts = _.filter(Game.creeps, function (creep) {
        return creep.memory.role == 'scout';
      });

      var queuedScouts = _.filter(creepQueue, function (creep) {
        return creep.memory.role == 'scout';
      });
      var hasContainer = false;

      if (myScouts.length + queuedScouts.length < 1) {
        var scoutBody = [MOVE];
        var creep = {
          body: scoutBody,
          memory: {
            role: 'scout',
            priority: 100,
            myRoom: this.name
          }
        };
        this.addCreep(creep);
      }
    },
    Room.prototype.harvesterBody = function (maxEnergy, workPartsNeeded, hasContainer) {

      var body = [WORK, MOVE];
      maxEnergy -= 150;
      var workPartsUsed = 1;
      //only add work parts if they are needed

      if (hasContainer == false) {
        body.push(CARRY);
        maxEnergy -= 50;
      }
      //used 200 energy already
      var j = 0;
      if (maxEnergy >= 600) {
        workPartsNeeded = 5;
      }
      if (workPartsNeeded > workPartsUsed) {
        for (var energyLeft = maxEnergy; energyLeft >= 100; energyLeft -= 100) {
          body.push(WORK);
          workPartsUsed++;
          if (j > 3) { //don't need more than 5 work parts
            break;
          }
          if (workPartsNeeded == workPartsUsed) {
            break;
          }
          j++;
        }
      }
      //add carry and move parts if the source is a long distance from spawn
      //absolete with containers?
      /*
      var carryPartsUsed = 1;
      var targetCarryParts = Math.ceil(spawnPathCost*2/50);
      if(targetCarryParts > carryPartsUsed){
        for (var energyLeft = maxEnergy; energyLeft >= 100; energyLeft -= 100) {
          body.push(CARRY);
          body.push(MOVE);
          carryPartsUsed++;
          if(carryPartsUsed == targetCarryParts){
            break;
          }
          j++;
        }
      }
      */
      return body;
    },

    Room.prototype.upgraderBody = function (hasContainer) {
      var maxEnergy = this.energyCapacityAvailable;
      var body = [WORK, MOVE];
      maxEnergy -= 150;

      if (hasContainer == false) {
        body.push(CARRY);
        maxEnergy -= 50;
      }
      //used 200 energy already
      var j = 0;

      for (var energyLeft = maxEnergy; energyLeft >= 100; energyLeft -= 100) {
        body.push(WORK);
        if (j > 3) { //TODO: calculate work parts
          break;
        }
        j++;
      }
      return body;
    },
    Room.prototype.builderBody = function () {
      var maxEnergy = this.energyCapacityAvailable;
      var body = [WORK, MOVE, CARRY];
      maxEnergy -= 200;

      //used 200 energy already
      var j = 0;
      for (var energyLeft = maxEnergy; energyLeft >= 200; energyLeft -= 200) {
        body.push(WORK);
        body.push(MOVE);
        body.push(CARRY);

        j++;
        if (j >= 2) { //TODO: calculate work parts
          break;
        }
      }
      return body;
    },
    Room.prototype.delivererBody = function (maxEnergy, carryParts, hasContainer) {
      var body = [];
      var i = 0;

      for (var energyLeft = maxEnergy; energyLeft >= 100; energyLeft -= 100) {
        body.push(CARRY);
        body.push(MOVE);
        i++;
        if (i >= carryParts) {
          break;
        }
        //create multiple deliverers
        if (hasContainer != true && i > 2) {
          break;
        }
      }
      return body;
    },
    Room.prototype.targetDelivererBody = function (carryParts) {
      var maxEnergy = this.energyCapacityAvailable;
      var body = [];
      var i = 0;

      for (var energyLeft = maxEnergy; energyLeft >= 100; energyLeft -= 100) {
        body.push(CARRY);
        body.push(MOVE);
        i++;
        if (i >= carryParts) {
          break;
        }
      }
      return body;
    },
    Room.prototype.moverBody = function (carryParts) {
      var maxEnergy = this.energyCapacityAvailable;
      var body = [];
      var i = 0;

      for (var energyLeft = maxEnergy; energyLeft >= 100; energyLeft -= 100) {
        body.push(CARRY);
        body.push(MOVE);
        i++;
        if (i >= carryParts) {
          break;
        }
      }
      return body;
    },
    Room.prototype.bodyCalculator = function (body) {
      var totalCost = 0;
      for (var bodyIterate = 0; bodyIterate < body.length; bodyIterate++) {
        var bodyPart = body[bodyIterate];
        if (bodyPart == WORK) {
          totalCost += 100;
        }
        if (bodyPart == MOVE) {
          totalCost += 50;
        }
        if (bodyPart == CARRY) {
          totalCost += 50;
        }
        if (bodyPart == ATTACK) {
          totalCost += 80;
        }
        if (bodyPart == RANGED_ATTACK) {
          totalCost += 150;
        }
        if (bodyPart == HEAL) {
          totalCost += 250;
        }
        if (bodyPart == CLAIM) {
          totalCost += 600;
        }
        if (bodyPart == TOUGH) {
          totalCost += 10;
        }
      }
      return totalCost;
    },
    Room.prototype.partCounter = function (body, targetBodyPart) {
      var parts = 0;
      for (var bodyIterate = 0; bodyIterate < body.length; bodyIterate++) {
        var myBodyPart = body[bodyIterate];
        //console.log('myBodypart: ' + myBodyPart.type + ' target' + targetBodyPart);
        var part = null;
        if (myBodyPart.type != null) { //real creep
          part = myBodyPart.type;
        } else { //queued creep
          part = myBodyPart;
        }
        if (part == targetBodyPart) {
          parts += 1;
        }
      }
      return parts;
    };
};
