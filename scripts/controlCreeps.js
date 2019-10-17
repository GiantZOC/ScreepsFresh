//force the creeps to behave depending on role
module.exports = function (cpuLog) {
  var roleHarvester = require('roleHarvester');
  var roleBuilder = require('roleBuilder');
  var roleGuard = require('roleGuard');
  var roleArcher = require('roleArcher');
  var roleUpgrader = require('roleUpgrader');
  var roleHealer = require('roleHealer');
  var roleDeliverer = require('roleDeliverer');
  var roleSentry = require('roleSentry');
  var roleRoomTaker = require('roleRoomTaker');
  var roleMover = require('roleMover');
  var roleKeeperKiller = require('roleKeeperKiller');
  var roleTargetDeliverer = require('roleTargetDeliverer');
  require('roleScout')();
  require('prototype.Room.createCreeps')();
  var creepCPU = Game.cpu.getUsed();
  var cpuLog = true;
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    try {
      //console.log('Creep: ' + creep.name);
      if (creep.memory.role == 'harvester') {
        roleHarvester(creep);
      }
      if (creep.memory.role == 'builder') {
        roleBuilder(creep);
      }
      if (creep.memory.role == 'guard') {
        roleGuard(creep);
      }
      if (creep.memory.role == 'upgrader') {
        roleUpgrader(creep);
      }
      if (creep.memory.role == 'healer') {
        roleHealer(creep);
      }
      if (creep.memory.role == 'archer') {
        roleArcher(creep);
      }
      if (creep.memory.role == 'deliverer') {
        roleDeliverer(creep);
      }
      if (creep.memory.role == 'sentry') {
        roleSentry(creep);
      }
      if (creep.memory.role == 'roomTaker') {
        roleRoomTaker(creep);
      }
      if (creep.memory.role == 'remoteHarvester') {
        roleRemoteHarvester(creep);
      }
      if (creep.memory.role == 'mover') {
        roleMover(creep);
      }
      if (creep.memory.role == 'keeperKiller') {
        roleKeeperKiller(creep);
      }

      if (creep.memory.role == 'targetDeliverer') {
        roleTargetDeliverer(creep);
      }

      if (creep.memory.role == 'scout') {
        creep.scout();
      }

      if(creep.memory.respawn != true && creep.memory.respawnTimer != null && creep.memory.respawnTimer <= creep.ticksToLive){
        creep.memory.respawn = true;
        //TODO: add this back in somehow
        console.log('CreepRespawn: ' + creep.name + creep.memory.role);
        var newCreep = {
          body: creep.body,
          memory: creep.memory
        };
        creep.room.addCreep(newCreep);
        creep.memory.respawn = true;

      }

      if (cpuLog == true && Game.cpu.getUsed() - creepCPU > 3) {
        console.log('Creep: ' + creep.name + ' Role: ' + creep.memory.role + ' CPU: ' + (Game.cpu.getUsed() - creepCPU));
      }
    } catch (err) {
      console.log('Creep: ' + creep.name + ' Role: ' + creep.memory.role + ' error: ' + err + ' stackTrace: ' + err.stack);
    }

    creepCPU = Game.cpu.getUsed();
  }
}
