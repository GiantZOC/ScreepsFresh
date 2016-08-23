module.exports = function (spawn, maxEnergy){
    var _ = require('lodash');
    var myFlags = Game.flags; // _.filter(Game.flags, {memory: {spawn.name}});
    //console.log('Spawn:' + spawn.name + ' flags' + _.size(myFlags));
    for(var i in myFlags) {
	   var flag = myFlags[i];
	   //flag.memory.defended = false;
	   //console.log('Flag logic:' + flag.memory.enemyCount   + ' defended: ' + flag.memory.defended  + ' spawn: ' + flag.memory.mySpawn);
	   var roomDefended = false;
	   if(flag.room != null && flag.room.memory != null && flag.room.memory.defended != null && flag.room.memory.defended == true){
	       roomDefended = true;
	   }
	   if(flag.memory.enemyCount > 0 && (flag.memory.defended == null || flag.memory.defended == false) && flag.memory.mySpawn == spawn.name && flag.room != spawn.room && roomDefended == false){
	        var attackPartCount = flag.memory.attackParts + flag.memory.rangedAttackParts;
	        
	        var j = 0;
	        var body = [];
	        
	        for (var energyLeft = maxEnergy; energyLeft >= 130; energyLeft -= 130) { 
                body.push(ATTACK);
                body.push(MOVE);
                j++;
                if(j > attackPartCount || j > 14){
                    break;
                }
            }
            spawn.createCreep( body,  null, {role: 'guard', spawn:spawn.id, flag:flag.id});    
            return true;
            
	        
	   }
    }
    return false;
};