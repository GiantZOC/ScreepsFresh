//shared memory for a room
module.exports = function () {
  Room.prototype.initialize = function () {
      require('prototype.Spawn')();
      var sources = this.find(FIND_SOURCES);
      var spawns = this.find(FIND_MY_SPAWNS);
      var minerals = this.find(FIND_MINERALS);
      var sourceFlags = this.find(FIND_FLAGS, {
        filter: {
          memory: {
            type: 'source'
          }
        }
      });
      var flags = this.find(FIND_FLAGS);
      var hostiles = this.find(FIND_HOSTILE_CREEPS);
      var sites = this.find(FIND_MY_CONSTRUCTION_SITES);
      var structures = this.find(FIND_STRUCTURES);
      var myStructures = this.find(FIND_MY_STRUCTURES);
      //var droppedEnergy = this.find(FIND_DROPPED_ENERGY);
      var myCreeps = this.find(FIND_MY_CREEPS);
      var damagedCreeps = _.filter(myCreeps, function (creep) {
        return creep.hits < creep.hitsMax;
      });

      this.memory.sources = sources;
      this.memory.spawns = spawns;
      this.memory.minerals = minerals;
      this.memory.sourceFlags = sourceFlags;
      this.memory.flags = flags;
      this.memory.hostiles = hostiles;
      this.memory.sites = sites;
      this.memory.myStructures = myStructures;
      this.memory.structures = structures;
      this.memory.droppedEnergy = droppedEnergy;
      this.memory.myCreeps = myCreeps;
      this.memory.damagedCreeps = damagedCreeps;
      //reset variables
      this.setDefended();
      //TODO: fix this
      //this.setFlagSpawnPathCost(sourceFlags, spawns);
      for (var spawnIterate = 0; spawnIterate < spawns.length; spawnIterate++) {
        var spawn = spawns[spawnIterate];
        spawn.setExtensions();
        spawn.setMaxEnergy();
        spawn.setCurrentEnergy();
      }
      this.setHostileParts();
      this.setSourceFlags();
      //this.setRoomPaths(room);
      this.setFlagSpawns();
      this.memory.lastOccupied = Game.time;
      this.setCostMatrix();
    },

    Room.prototype.getSpawns = function () {
      return this.memory.spawns;
    },
    Room.prototype.getSources = function () {
      return this.memory.sources;
    },
    Room.prototype.getMinerals = function () {
      return this.memory.minerals;
    },
    Room.prototype.getSourceFlags = function () {
      return this.memory.sourceFlags;
    },
    Room.prototype.getFlags = function () {
      return this.memory.flags;
    },
    Room.prototype.getHostiles = function () {
      return this.memory.hostiles;
    },
    Room.prototype.getExtensions = function () {
      return this.memory.extensions;
    },
    Room.prototype.getSites = function () {
      return this.memory.sites;
    },
    Room.prototype.getStructures = function () {
      return this.memory.structures;
    },
    Room.prototype.getCreeps = function () {
      return this.memory.myCreeps;
    },
    Room.prototype.getDamagedCreeps = function () {
      return this.memory.damagedCreeps;
    },
    Room.prototype.setDefended = function () {
      this.memory.damagedCreep = false;
      this.memory.defended = false;
      //Room defended

      if ((this.memory.myAttackParts + this.memory.myRangedAttackParts) >= (this.memory.attackParts + this.memory.rangedAttackParts)) {
        this.memory.defended = true;
      }
      this.memory.myAttackParts = 0;
      this.memory.myRangedAttackParts = 0;
    },

    Room.prototype.getExtensions = function () {
      var structures = this.getStructures();
      var extensions = _.select(structures, function (c) {
        return c.structureType == STRUCTURE_EXTENSION;
      });
      return extensions;
    },

    Room.prototype.setSourceFlags = function () {
      if (this.memory.sourceFlagsSet == null || this.memory.souceFlagsSet == false) {
        var sources = this.getSources();
        var roomFlags = [];
        for (var source in sources) {
          var mySource = sources[source];
          var flagName = 'S_' + this.name + '_' + source;
          mySource.pos.createFlag([flagName]);
        }
        this.memory.sourceFlagsSet = true;
      }

    },
    Room.prototype.setFlagSpawns = function () {
      if (this.memory.sourceFlagSpawnCheck == null) {
        var flags = this.getSourceFlags();
        for (var flag in flags) {
          var myFlag = flags[flag];
          var spawn = myFlag.pos.findClosestByPath(FIND_MY_SPAWNS);
          if (spawn != null) {
            myFlag.memory.mySpawn = spawn.id;
            myFlag.memory.type = 'source';
          }
        }
      }
    },

    Room.prototype.setPaths = function () {
      var spawnSourcePaths = [];
      var myPaths = this.memory.paths;
      if (myPaths == null) {
        var mySpawns = this.getSpawns();

        for (var j = 0; j < mySpawns.length; j++) {
          var spawn = mySpawns[j];
          var sourceFlags = _.filter(this.getFlags(), {
            memory: {
              mySpawn: spawn
            }
          });

          for (var i = 0; i < sourceFlags.length; i++) {
            var source = sourceFlags[i];
            var path = this.findPath(spawn.pos, source.pos, {
                ignoreCreeps: true,
                heuristicWeight: 1000
              })
              //console.log(path);
            if (path.length > 0) {
              spawnSourcePaths.push(path);
            }
          }
        }

        var spawnControllerPaths = [];
        for (var j = 0; j < mySpawns.length; j++) {
          var spawn = mySpawns[j];
          var controller = this.controller;
          var path = this.findPath(spawn.pos, controller.pos, {
            ignoreCreeps: true,
            heuristicWeight: 1000
          })
          if (path.length > 0) {
            spawnControllerPaths.push(path);
          }

        }

        var myPaths = {
          spawnSourcePaths: spawnSourcePaths,
          spawnControllerPaths: spawnControllerPaths
        };
        this.memory.paths = myPaths;
      }
    },
    Room.prototype.setHostileParts = function () {
      //Count Hostile Parts
      var attackParts = 0;
      var rangedAttackParts = 0;
      var hostiles = this.getHostiles();
      this.memory.enemyCount = hostiles.length;
      if (hostiles.length > 0) {
        for (var hostile in hostiles) {
          var myHostile = hostiles[hostile];
          attackParts += myHostile.getActiveBodyparts(ATTACK);
          rangedAttackParts += myHostile.getActiveBodyparts(RANGED_ATTACK);
        }
      }

      this.memory.attackParts = attackParts;
      this.memory.rangedAttackParts = rangedAttackParts;
    },
    Room.prototype.getAttackParts = function () {
      return this.memory.attackParts;
    },
    Room.prototype.getRangesAttackParts = function () {
      return this.memory.rangedAttackParts;
    },
    Room.prototype.getBuildTarget = function () {
      var buildTarget = Game.getObjectById(this.memory.buildTarget);
      var buildTargetDenominator = this.memory.denominator;
      if (buildTarget == null) {
        buildTarget = this.getNewBuildTarget();
      } else if (buildTarget.progress != null) { //construtionSite
        if (buildTarget.progress == buildTarget.progessTotal) {
          buildTarget = this.getNewBuildTarget();
        }
      } else if (buildTarget.structureType == STRUCTURE_WALL) {
        if ((buildTarget.hits > buildTarget.hitsMax / buildTargetDenominator) || buildTarget.hits == buildTarget.hitsMax) {
          buildTarget = this.getNewBuildTarget();
        }
      } else if (buildTarget.structureType == STRUCTURE_RAMPART) {
        if ((buildTarget.hits > (buildTarget.hitsMax / buildTargetDenominator + buildTarget.hitsMax / 100)) || buildTarget.hits == buildTarget.hitsMax) {
          buildTarget = this.getNewBuildTarget();
        }
      } else if (buildTarget.structureType == STRUCTURE_ROAD) {
        if (myRoad.hits > myRoad.hitsMax * .95) {
          buildTarget = this.getNewBuildTarget();
        }
      }
      return buildTarget;
    },
    Room.prototype.getNewBuildTarget = function () {

      //TODO: sort everything in a queue
      var target;
      if (this.getMyRepair(100000) != null) {
        target = this.memory.myRepair;
        action = 'Desparate Repair';
      } else if (this.getMyRepair(10000) != null) {
        target = this.memory.myRepair;
        action = 'Desparate Repair';
      } else if (this.getMyRepair(100) != null) {
        target = this.memory.myRepair;
        action = '100 Repair';
      } else if (this.getMyConstructionSite() != null) {
        target = this.memory.construction;
        action = 'Construction';
      } else if (this.getMyWall(1000) != null) {
        target = this.memory.myWall;
        action = '1000 Wall Repair';
      } else if (this.getMyRoad() != null) {
        target = this.memory.myRoad;
        action = 'Roads';
      } else if (this.getMyRepair(10) != null) {
        target = this.memory.myRepair;
        action = '10 Repair';
      } else if (this.getMyWall(100) != null) {
        target = this.memory.myWall;
        action = '100 Wall';
      } else if (this.getMyRepair(50) != null) {
        target = this.memory.myRepair;
        action = '50 Repair';
      } else if (this.getMyRepair(2, false) != null) {
        target = this.memory.myRepair;
        action = '2 Repair';
      } else if (this.getMyWall(10) != null) {
        target = this.memory.myWall;
        action = '10 Wall';
      } else if (this.getMyWall(2) != null) {
        target = this.memory.myWall;
        action = '2 Wall';
      } else if (this.getMyWall(1) != null) {
        target = this.memory.myWall;
        action = '1 Wall';
      } else if (this.getMyRepair(1, false) != null) {
        target = this.memory.myRepair;
        action = '1 Repair';
      }
      this.memory.buildAction = action;
      this.memory.buildTarget = target;
      return Game.getObjectById(target);

    },
    Room.prototype.getBuildAction = function () {
      return this.memory.buildAction;
    },

    Room.prototype.getMyConstructionSite = function () {
      var constructionSite = Game.getObjectById(this.memory.construction);
      if (constructionSite == null) {
        constructionSite = _.find(this.getSites());
        //console.log('constructionSite: ' + constructionSite);
        if (constructionSite != null) {
          this.memory.construction = constructionSite.id;
          this.memory.denominator = null;
        }
      }
      return constructionSite;

    },

    Room.prototype.getMyRepair = function (denominator) {
      var myRepair = Game.getObjectById(this.memory.myRepair);
      if (myRepair == null || myRepair.hits > (myRepair.hitsMax / denominator) || myRepair.hits == myRepair.hitsMax) {
        myRepair = _.find(this.getStructures(), function (i) {
          return i.hits < (i.hitsMax / denominator) && i.structureType != STRUCTURE_WALL;;
        });

        if (myRepair != null) {
          this.memory.myRepair = myRepair.id;
          this.memory.denominator = denominator;
        } else {
          this.memory.myRepair = null;
        }
      }
      return myRepair;
    },

    Room.prototype.getMyRoad = function () {
      var myRoad = Game.getObjectById(this.memory.myRoad);
      if (myRoad == null || myRoad.hits > myRoad.hitsMax * .95) {
        myRoad = _.find(this.getStructures(), function (i) {
          return i.hits < i.hitsMax * .5 && i.structureType == STRUCTURE_ROAD;
        });

        //console.log('myRoad: ' + myRoad);
        if (myRoad != null) {
          this.memory.myRoad = myRoad.id;
          this.memory.denominator = null;
        }
      }
      return myRoad;
    },

    Room.prototype.getMyWall = function (denominator) {
      var myWall = Game.getObjectById(this.memory.myWall);
      if (myWall == null || myWall.hits >= myWall.hitsMax / denominator) {
        myWall = _.filter(this.getStructures(), function (i) {
          return i.hits < i.hitsMax / denominator && i.structureType == STRUCTURE_WALL;
        });
        //console.log('myWall: ' + myWall);
        if (myWall != null) {
          this.memory.myWall = myWall.id;
          this.memory.denominator = denominator;
        }
      }
      return myWall;
    },
    Room.prototype.findStructureByType = function (type) {
      return this.find(FIND_MY_STRUCTURES, {
        filter: function (i) {
          return i.structureType == type;
        }
      });
    },
    Room.prototype.getCostMatrix = function(){
      var costMatrix = this.memory.costMatrix;
      if(costMatrix == null){
        return new PathFinder.CostMatrix;
      }
      return costMatrix;
    },
    Room.prototype.setCostMatrix = function(){
      let costs = new PathFinder.CostMatrix;

      this.getStructures().forEach(function (structure) {
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
      this.getCreeps().forEach(function (creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
      });

      // Avoid creeps in the room
      this.getHostiles().forEach(function (creep) {
        for(var x = -3; x <= 3; x++){
          for(var y = -3; y <= 3; y++){
            costs.set(creep.pos.x + x, creep.pos.y + y, 0xff);
          }
        }
      });
      this.memory.costMatrix = costs;
    };


};
