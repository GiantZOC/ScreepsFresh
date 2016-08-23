module.exports = function () {
  StructureSpawn.prototype.customCanCreateCreep = function (body) {
      var code = this.canCreateCreep(body);
      if (code == 0) {
        return true;
      } else if (code == ERR_NOT_OWNER) {
        return 'ERR_NOT_OWNER';
      } else if (code == ERR_NAME_EXISTS) {
        return 'ERR_NAME_EXISTS';
      } else if (code == ERR_BUSY) {
        return 'ERR_BUSY';
      } else if (code == ERR_NOT_ENOUGH_ENERGY) {
        return 'ERR_NOT_ENOUGH_ENERGY';
      } else if (code == ERR_INVALID_ARGS) {
        return 'ERR_INVALID_ARGS';
      } else if (code == ERR_RCL_NOT_ENOUGH) {
        return 'ERR_RCL_NOT_ENOUGH';
      }
      return false;
    },

    StructureSpawn.prototype.setExtensions = function () {
      require('prototype.Room.memory')();
      this.memory.extensions = this.room.getExtensions();
    },
    StructureSpawn.prototype.getExtensions = function () {
      return this.memory.extensions;
    },
    StructureSpawn.prototype.setMaxEnergy = function () {
      var maxEnergy = 300;
      var extensions = this.getExtensions();
      if (extensions != null) {
        maxEnergy = 300 + 50 * extensions.length;
      }
      this.memory.maxEnergy = maxEnergy;
    },
    StructureSpawn.prototype.getMaxEnergy = function () {
      return this.memory.maxEnergy;
    },
    StructureSpawn.prototype.setCurrentEnergy = function () {
      require('prototype.Room.memory')();
      var currentEnergy = this.energy;
      var extensions = this.room.getExtensions();
      for (var i = 0; i < extensions.length; i++) {
        var extension = extensions[i];
        if (extension != null) {
          currentEnergy += extension.energy;
        }
      }

      this.memory.currentEnergy = currentEnergy;
      return currentEnergy;
    },
    StructureSpawn.prototype.getCurrentEnergy = function () {
      return this.memory.currentEnergy;
    };
};
