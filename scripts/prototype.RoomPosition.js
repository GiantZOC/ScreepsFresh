module.exports = function () {
  RoomPosition.prototype.needsWall = function () {
      var structures = this.lookFor(LOOK_STRUCTURES);

      for (var i = 0; i < structures.length; i++) {
        var structure = structures[i];
        if ((structure.type == STRUCTURE_RAMPART || structure.type == STRUCTURE_WALL)) {
          return false;
        }
      }
      if (!this.pathable()) {
        return false;
      }
      return true;
    },

    RoomPosition.prototype.positionCloseToCriticalStructure = function (StructuresToAvoid) {
      for (var structureIndex = 0; structureIndex < StructuresToAvoid.length; structureIndex++) {
        var structure = StructuresToAvoid[structureIndex];
        if (this.getRangeTo(structure.pos) < 3) {
          return true;
        }
        //if(position.x == 11 && position.y == 9){
        //  console.log('structure: ' + structure + ' structure Range ' + position.getRangeTo(structure));
        //}
      }
      return false;
    },

    RoomPosition.prototype.positionCloseToSource = function (Sources) {
      var isClose = false;
      for (var sourceIndex = 0; sourceIndex < Sources.length; sourceIndex++) {
        var source = Sources[sourceIndex];
        if (this.getRangeTo(source) < 7) {
          isClose = true;
          break;
        }
      }
      return isClose;
    },
    //make sure that position isn't in critical path
    RoomPosition.prototype.positionInCriticalPath = function () {
      var room = this.room();
      for (var i = 0; i < room.memory.paths.spawnSourcePaths.length; i++) {
        var spawnSourcePath = room.memory.paths.spawnSourcePaths[i];
        for (var pathIndex = 0; pathIndex < spawnSourcePath.length; pathIndex++) {
          var pathPosition = spawnSourcePath[pathIndex];
          if (pathPosition.x == this.x && pathPosition.y == this.y && pathPosition.room == room) {
            return true;
          }
          //if(thisRoom.paths.spawnSourcePaths[i])
        }
      }
      return false;
    },
    RoomPosition.prototype.blocksPath = function (position) {
      var up = new RoomPosition(this.x, this.y - 1, this.roomName);
      var down = new RoomPosition(this.x, this.y + 1, this.roomName);
      var left = new RoomPosition(this.x - 1, this.y, this.roomName);
      var right = new RoomPosition(this.x + 1, this.y, this.roomName);

      if (!this.pathable(up) && !this.pathable(down)) {
        return true;
      }

      if (!this.pathable(left) && !this.pathable(right)) {
        return true;
      }
      return false;
    },
    RoomPosition.prototype.pathable = function () {
      var structures = this.lookFor(LOOK_STRUCTURES);

      for (var i = 0; i < structures.length; i++) {
        var structure = structures[i];
        if (!(structure.type == STRUCTURE_RAMPART || structure.type == STRUCTURE_ROAD)) {
          return false;
        }
      }

      //avoid tring to build on same site
      var sites = this.lookFor(LOOK_CONSTRUCTION_SITES);
      if (sites.length > 0) {
        return false;
      }
      var terrain = Game.map.getTerrainAt(this); //position.lookFor(LOOK_TERRAIN);

      if (terrain == 'wall') {
        return false;
      }

      return true;
    },
    RoomPosition.prototype.getCloseOpenSpace = function () {
      var terrain;
      var room = this.room();
      for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
          terrain = room.lookForAt('terrain', this.x + x, this.y + y);
          if (terrain != 'wall') {
            return new RoomPosition(this.x + x, this.y + y, this.roomName);
          }
        }
      }
      return null;
    },
    //TODO: rewrite to use room and then filter results
    RoomPosition.prototype.findClosestStructureByType = function (type) {
      return this.findClosestByPath(FIND_STRUCTURES, {
        filter: function (i) {
          return i.structureType == type;
        }
      });
    },
    RoomPosition.prototype.BuildWallorRampart = function () {
      if (this.needsWall()) {
        var room = this.room();
        if ((this.x + this.y) % 2 == 1) {
          room.createConstructionSite(this.x, this.y, STRUCTURE_WALL);
        } else {
          room.createConstructionSite(this.x, this.y, STRUCTURE_RAMPART);
        }
        return true;
      }
      return false;
    },
    RoomPosition.prototype.room = function(){
      return Game.rooms[this.roomName];
    }
    RoomPosition.prototype.terrainCost = function () {
      console.log('position' + position + ' room' + this.roomName + ' x' + this.x + ' y' + this.y);
      var room = this.room();
      var structures = room.lookForAt(LOOK_STRUCTURES, this.x, this.y);

      for (var i = 0; i < structures.length; i++) {
        var structure = structures[i];
        if (structure.type == STRUCTURE_ROAD) {
          return 1;
        }
      }
      var terrain = Game.map.getTerrainAt(this);
      if (terrain == 'plain') {
        return 2;
      }
      if (terrain == 'swamp') {
        return 5;
      }
      return null;

    },

    RoomPosition.prototype.countOpenSpaces = function () {
      var terrain;
      var i = 0;
      var room = this.room()
      if (room != null) {
        for (var x2 = -1; x2 < 2; x2++) {
          for (var y2 = -1; y2 < 2; y2++) {
            terrain = room.lookForAt('terrain', this.x + x2, this.y + y2);
            if (terrain != 'wall') {
              i++;
            }

          }
        }
      }
      return i;
    };

};
