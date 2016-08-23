module.exports = function () {
  Flag.prototype.initialize = function () {
      this.memory.defenderParts = 0;
      this.memory.defended = false;

      if (this.room != null) {
        this.memory.enemyCount = this.room.memory.enemyCount;
        this.memory.attackParts = this.room.memory.attackParts;
        this.memory.rangedAttackParts = this.room.memory.rangedAttackParts;
        this.memory.defended = this.room.memory.defended;
      }
      if (this.memory.type == null) {
        this.memory.type = 'source';
      }

      this.setOpenSpaces();
    },
    Flag.prototype.getSpawnPathCost = function () {
      throw "Not implemented";
      return this.memory.spawnPathCost;
    },

    Flag.prototype.getOpenSpaces = function () {
      return this.memory.openSpaces;
    },

    Flag.prototype.getSpawn = function () {
      var spawn = null;
      if (this.memory.mySpawn != null) {
        spawn = Game.getObjectById(this.memory.mySpawn);
      }
      return spawn;
    },

    Flag.prototype.getContainer = function () {
      var myContainer = Game.getObjectById(this.memory.container);
      if (myContainer == null) {
        //TODO: check for container
      }
      return myContainer;
    },

      Flag.prototype.setOpenSpaces = function () {
        require('prototype.RoomPosition')();
        if(this.memory.openSpaces == null){
          openSpaces = this.pos.countOpenSpaces();
          this.memory.openSpaces = openSpaces;
        }
      };

      /*
      flag.prototype.setFlagSpawnPathCost: function (flags, spawns) {
        var globalFunctions = require('globalFunctions');
        console.log('SpawnPathCost:' + ' flags ' + flags + ' spawns: ' + spawns);
        for (var spawnIndex = 0; spawnIndex < spawns.length; spawnIndex++) {
          var spawn = spawns[spawnIndex];
          for (var flagIterate = 0; flagIterate < flags.length; flagIterate++) {
            flag = flags[flagIterate];
            var range = spawn.pos.getRangeTo(flag);
            flag.memory.spawnDistance = range;
            var pathCost = globalFunctions.pathCost(spawn.pos.findPathTo(flag));
            flag.memory.spawnPathCost = pathCost;
            console.log('Spawn : ' + spawn.name + ' flag: ' + flag.name + ' range = ' + range + ' pathCost: ' + pathcost);
          }
        }
      },
      */
};
