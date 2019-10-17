//manage the room
module.exports = {
  mainLoop: function (cpuLog) {
    require('prototype.Room.construction')();
    require('prototype.Room.createCreeps')();
    require('prototype.Room.memory')();
    var startCPU;
    //cpuLog=true;
    for (var name in Game.rooms) {
      var room = Game.rooms[name];
      try {
        startCPU = Game.cpu.getUsed();
        if (cpuLog) {
          console.log('Before memory ' + Game.cpu.getUsed());
        }
        room.initialize();

        if (cpuLog) {
          console.log('Before ManageResources ' + Game.cpu.getUsed());
        }
        room.createCreeps();

        if (cpuLog) {
          console.log('Before construction ' + Game.cpu.getUsed());
        }

        room.construction(cpuLog);

        if (cpuLog) {
          console.log('After construction ' + Game.cpu.getUsed());
        }
        if(Game.cpu.getUsed() - startCPU > 5){
          console.log('CPU Used: ' + (Game.cpu.getUsed() - startCPU) + ' Room: ' + room);
        }
      } catch (err) {
        console.log('Room: ' + room + ' Error: ' + err  + ' stackTrace: ' + err.stack);
      }
      /*
      var sites = thisRoom.find(FIND_CONSTRUCTION_SITES);
      for(var i =0; sites.length; i++){
          var site = sites[i];
          site.remove();
      }
      */
    }

  },

};
