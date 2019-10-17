//shared functions for construction projects
module.exports = function () {

  Room.prototype.construction = function (cpuLog) {
      if (true) { //Game.time % 10 == 1
        var sites = this.find(FIND_MY_CONSTRUCTION_SITES);
        //this.removeSites(sites);
        if (sites.length < 3) {
          if (this.controller == null || this.controller.my != true) {
            return;
          }

          if (this.createStorage(cpuLog)) {} else if (this.createExtensions(cpuLog)) {} else if (this.createTowers(cpuLog)) {} else if (this.createWalls(cpuLog)) {} else if (this.createRoadsStorageSource(sites.length, cpuLog)) {}
          if (this.controller.level == 1) {

          }
          if (this.controller.level >= 2) {
            //walls, ramparts, extensions, roads, containers
          } else if (this.controller.level >= 3) {

          }
          if (this.controller.level >= 4) {}
          if (this.controller.level >= 5) {}
          if (this.controller.level >= 6) {}
          if (this.controller.level >= 7) {}
        }
      }
    },

    Room.prototype.createStorage = function (cpuLog) {
      if (cpuLog) {
        console.log('Before storage ' + Game.cpu.getUsed());
      }
      if (this.controller.level >= 4 && this.storage == null) {

        var site = _.find(this.getSites(), function (c) {
          return c.structureType == STRUCTURE_STORAGE;
        });

        if (site == null) {
          var position = this.getNewPosition(new RoomPosition(25, 25, this.name));
          this.createConstructionSite(position.x, position.y, STRUCTURE_STORAGE);
          return true;
        }
      }
      return false;
    },

    Room.prototype.createTowers = function (cpuLog) {
      if (cpuLog) {
        console.log('Before towers ' + Game.cpu.getUsed());
      }
      var towerCount = 0;
      if (this.controller.level == 3 || this.controller.level == 4) {
        towerCount = 1;
      } else if (this.controller.level == 5 || this.controller.level == 6) {
        towerCount = 2;
      } else if (this.controller.level == 7) {
        towerCount = 3;
      } else if (this.controller.level == 8) {
        towerCount = 6;
      }

      var towers = _.filter(this.getStructures(), function (c) {
        return c.structureType == STRUCTURE_TOWER;
      });

      var towerSites = _.filter(this.getSites(), function (c) {
        return c.structureType == STRUCTURE_TOWER;
      });
      if ((towers.length + towerSites.length) < towerCount) {
        var position = this.getNewPosition(new RoomPosition(25, 25, this.name));
        this.createConstructionSite(position.x, position.y, STRUCTURE_TOWER);
        return true;
      }
      return false;
    },

    Room.prototype.createContainers = function (cpuLog) {
      require('prototype.RoomPosition')();
      if (cpuLog) {
        console.log('Before containers ' + Game.cpu.getUsed());
      }
      var flags = this.getSourceFlags();
      for (var flagIterate = 0; flagIterate < flags.length; flagIterate++) {
        var flag = flags[flagIterate];
        if (flag.memory.container != null && flag.memory.container != 'inProgress') {
          var container = Game.getObjectById(flag.memory.container);
          if (container == null) {
            flag.memory.container = null;
          } else {
            continue;
          }
        } else {
          var position = flag.pos.getCloseOpenSpace();
          if (position != null) {
            this.createConstructionSite(position.x, position.y, STRUCTURE_CONTAINER);
            flag.memory.container

          }
        }
      }
    },

    Room.prototype.getNewPosition = function (target) {
      require('prototype.RoomPosition');
      var position;
      var closestPosition;
      var closestRange;
      var StructuresToAvoid = this.getSpawns();
      StructuresToAvoid.push(this.controller);
      if (this.storage != null) {
        StructuresToAvoid.push(this.storage);
      }
      var Sources = this.getSources();
      //loop  through positions not near  the edge
      for (var x = 5; x < 45; x = x + 2) {
        for (var y = 5; y < 45; y = y + 2) {
          position = new RoomPosition(x, y, this.name);
          if (position != null) {
            if (position.pathable() == true &&
              position.blocksPath() == false &&
              position.positionCloseToCriticalStructure(StructuresToAvoid) == false &&
              position.positionCloseToSource(Sources) == false &&
              position.positionInCriticalPath() == false) {
              var range = position.getRangeTo(target);
              if ((closestPosition == null || (range != null && (closestRange > range)))) {
                closestPosition = position;
                closestRange = range;
              }
            }

          }
        }
      }
      console.log('Best position: ' + closestPosition);
      return closestPosition;
    },
    Room.prototype.createExtensions = function (cpuLog) {
      if (cpuLog) {
        console.log('Before extensions ' + Game.cpu.getUsed());
      }
      var myExtensions = this.getExtensions();
      var sites = this.getSites();
      var extensionSites = _.filter(sites, function (c) {
        return c.structureType == STRUCTURE_EXTENSION;
      });

      Array.prototype.push.apply(myExtensions, extensionSites);
      var target = this.storage;
      if (target == null) {
        var spawns = this.getSpawns();
        if (spawns.length > 0) {
          target = spawns[0];
        }
      }
      var position;
      //console.log(StructuresToAvoid);
      if (myExtensions.length < this.maxExtensionCount()) {
        position = this.getNewPosition(target);
        this.createConstructionSite(position.x, position.y, STRUCTURE_EXTENSION);
        return true;
      }
      return false;
    },
    Room.prototype.createWalls = function (cpuLog) {
      require('prototype.RoomPosition');

      if (this.memory.wallsComplete == null || (this.memory.wallsComplete) > 100) {
        if (cpuLog) {
          console.log('Before walls ' + Game.cpu.getUsed());
        }
        var x;
        var y;
        var position;
        for (x = 2; x < 47; x++) {
          y = 2; //top
          position = new RoomPosition(x, y, this.name);
          if (position.BuildWallorRampart()) {
            return true;
          }

          y = 47; //bottom
          position = new RoomPosition(x, y, this.name);
          if (position.BuildWallorRampart()) {
            return true;
          }
        }

        for (y = 2; y < 47; y++) {
          x = 2; //left
          position = new RoomPosition(x, y, this.name);
          if (position.BuildWallorRampart()) {
            return true;
          }

          x = 47; //right
          position = new RoomPosition(x, y, this.name);
          if (position.BuildWallorRampart()) {
            return true;
          }

        }
        this.memory.wallsComplete = 0;
      }
      else{
        this.memory.wallsComplete = this.memory.wallsComplete + 1;
      }
      return false;
    },

    Room.prototype.createRoadsStorageSource = function (siteCount, cpuLog) {
      if (cpuLog) {
        console.log('Before roadsStorageSource ' + Game.cpu.getUsed());
      }
      var position;
      var newRoad = false;
      var storage = this.storage;

      if (storage != null) {
        var sourceFlags = this.getSourceFlags();

        for (var j = 0; j < sourceFlags.length; j++) {
          var flag = sourceFlags[j];
          var path = this.findPath(flag.pos, storage.pos, {
            ignoreCreeps: true,
            swampCost: 1
          });
          //console.log(path);
          if (path.length > 0) {
            for (var i = 0; i < path.length; i++) {
              position = new RoomPosition(path[i].x, path[i].y, this.name);
              var objects = position.look();
              var skip = false;
              objects.forEach(function (lookObject) {
                if (lookObject.type == 'structure' && lookObject.structure.structureType == STRUCTURE_ROAD) {
                  skip = true;
                } else if (lookObject.type == 'constructionSite' && lookObject.structureType == STRUCTURE_ROAD) {
                  skip = true;
                }
              });

              if (skip == false) {
                this.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                siteCount++;
                if (siteCount > 5) {
                  break;
                }
                newRoad = true;
              }
            }
          }
        }
      }
      return newRoad;
    },
    Room.prototype.createRoadsSpawnSource = function () {

      var mySpawns = this.getSpawns();
      var position;
      var newRoad = false;
      for (var j = 0; j < mySpawns.length; j++) {
        var spawn = mySpawns[j];
        var sourceFlags = _.filter(this.getSourceFlags(), {
          memory: {
            mySpawn: spawn
          }
        });
        console.log('SourceFlags: ' + sourceFlags);
        for (var i = 0; i < sourceFlags.length; i++) {
          var source = sourceFlags[i];
          var path = this.findPath(spawn.pos, source.pos, {
              ignoreCreeps: true,
              heuristicWeight: 1000
            })
            //console.log(path);
          if (path.length > 0) {
            for (var i = 0; i < path.length; i++) {
              position = new RoomPosition(path[i].x, path[i].y, this.name);
              var objects = position.look();
              var skip = false;
              objects.forEach(function (lookObject) {
                console.log('objects: ' + lookObject);
                if (lookObject.type == LOOK_STRUCTURES && lookObject.structure == STRUCTURE_ROAD) {
                  skip = truelookObject
                } else if (lookObject.type == LOOK_CONSTRUCTION_SITES && object.structureType == STRUCTURE_ROAD) {
                  skip = true;
                }
              });
              if (skip == false) {
                this.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                newRoad = true;
              }
            }
          }
        }
      }
      return newRoad;
    },
    Room.prototype.createRoadsSpawnExtension = function (siteCount) {
      // ExtensionRoads
      var spawns = this.getSpawns();
      for (var j = 0; j < spawns.length; j++) {
        var spawn = spawns[j];
        var extensions = this.getExtensions();
        for (var i = 0; i < extensions.length; i++) {
          var path = this.findPath(spawn.pos, extensions[i].pos, {
            ignoreCreeps: true,
            heuristicWeight: 1000
          })
          for (var j = 0; j < path.length; j++) {
            this.createConstructionSite(path[j].x, path[j].y, STRUCTURE_ROAD);
            siteCount++;
            if (siteCount > 5) {
              return;
            }
          }
        }
      }
    },

    Room.prototype.removeSites = function (sites) {
      for (var i = 0; i < sites.length; i++) {
        var site = sites[i];
        site.remove();
      }
    }
  Room.prototype.maxExtensionCount = function () {
    var controllerLevel = this.controller.level;
    if (controllerLevel == 1) {
      return 0;
    }
    if (controllerLevel == 2) {
      return 5;
    }
    if (controllerLevel == 3) {
      return 10;
    }
    if (controllerLevel == 4) {
      return 20;
    }
    if (controllerLevel == 5) {
      return 30;
    }
    if (controllerLevel == 6) {
      return 40;
    }
    if (controllerLevel == 7) {
      return 50;
    }
    if (controllerLevel == 8) {
      return 60;
    }
  };

};
