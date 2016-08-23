module.exports = function (creep, pathName, target, opts) {
  var currentCPU = Game.cpu.getUsed();
  var profile = false;

  if (target == null || target.pos == null || (creep.pos.x == target.pos.x && creep.pos.y == target.pos.y)) {
    creep.say('Stay');
    creep.memory.stay = true;
    return;
  } else {
    creep.memory.stay = false;
    if (creep.memory[pathName] != null && creep.memory[pathName].length >= 1) { // && creep.memory[pathName + 'PreviousPos'].x != target.pos.x && creep.memory[pathName + 'PreviousPos'].y != target.pos.y
      var code = creep.moveByPath(creep.memory[pathName]);
      //console.log(creep.memory['PreviousPos'] != null && creep.memory['PreviousPos'].x == creep.pos.x && creep.memory['PreviousPos'].y == creep.pos.y);
      if (creep.memory['PreviousPos'] != null && creep.memory['PreviousPos'].x == creep.pos.x && creep.memory['PreviousPos'].y == creep.pos.y && creep.pos.getRangeTo(target) > 1) {
        creep.memory.stuckCount = creep.memory.stuckCount + 1;
        if (creep.memory.stuckCount >= 3) {
          creep.memory.stuckCount = 0;
          code = -10;
        }

      } else {
        creep.memory.stuckCount = 0;
      }
      creep.memory['PreviousPos'] = creep.pos;
      if (code == -1) { //notowner
      } else if (code == -4) //spawning
      {} else if (code == -5) { //path doesn't match location
        creep.say('-5');
        creep.moveTo(target, opts);
        if (!creep.spawning && creep.memory._move != null) {
          creep.memory[pathName] = creep.memory._move.path;
          creep.say('NewP');
        }
      } else if (code == -10) //path not valid array
      {
        creep.say('-10');
        creep.moveTo(target, opts);
        if (!creep.spawning && creep.memory._move != null) {
          creep.memory[pathName] = creep.memory._move.path;
          creep.say('NewP');
        }
      } else if (code == -11) //too tired
      {
        //keep on trucking
      } else if (code == -12) //nobody
      {
        //just die then
      } else {
        if (creep.memory._move != null && creep.memory._move.path != null) {
          creep.memory[pathName + 'temp'] = creep.memory._move.path;
          creep.say('Reuse');
        }
      }
    } else { //new path
      creep.moveTo(target, opts);
      if (!creep.spawning && creep.memory._move != null && creep.memory._move.path != null) {
        creep.memory[pathName] = creep.memory._move.path;
        creep.say('NewP');
      }
    }
    if (profile == true && Game.cpu.getUsed() - currentCPU > 5) {
      console.log('cachedPath ' + 'creepName: ' + creep.name + ' pathName: ' + pathName + ' CPU: ' + (Game.cpu.getUsed() - currentCPU));
    }
  }
};
