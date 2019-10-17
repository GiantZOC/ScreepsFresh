//scouts out rooms to take or attack
module.exports = function () {
  Creep.prototype.scout = function () {
    require('prototype.Creep')();
    //this.getNewScoutRoom();
    //if(!this.memory.path) {
      //this.getNewScoutRoom();
      //this.memory.path = creep.pos.findPathTo(target);
    //}
    var scoutRoom = 'E28S37';
    var pos = new RoomPosition(25, 25, scoutRoom);
    var goal = {pos:pos, range:50};
    var findPath = this.pathAvoidHostiles(goal, null);
    this.memory.path = findPath.path;
    this.customMoveByPath(findPath.path);

    //
    //this.memory.scoutRoom = scoutRoom;

    //var path = this.memory.path;


    /*

    let pos = path[0];
    console.log('Pos: ' + pos.x + ' ' + pos.y + ' ' + pos.roomName);
    if(pos.x == this.pos.x && pos.y == this.pos.y){
      path.splice(0,1);
    }

    if(pos.roomName != this.pos.roomName){
      if( pos.x == 0 || pos.x == 49 || pos.y == 0 || pos.y == 49){
        console.log('Edge');
        path.splice(0,1);
      }
      else{
        console.log('Impossible');
      }

      var badRooms = this.memory.badRooms;
      if(badRooms == null){
        badRooms = [];
      }
      badRooms.push(this.memory.scoutRoom);
      this.memory.badRooms = badRooms;

    }
    */
    //pos = path[0];
    //console.log('Pos: ' + pos + pos.x +  ' ' + pos.y);
    //console.log('Direction: ' + this.pos.getDirectionTo(pos.x, pos.y));

    //var result = this.move(this.pos.getDirectionTo(pos.x, pos.y));
    //if(result == 0){

    //}
    /*

    */

    //console.log('Result: ' + result);
    this.say('Scout');
    //
    /*
    if(!this.customMoveByPath(this.memory.path)){
      console.log('Path problem');

      //this.memory.badRooms = [];
      this.memory.path = null;
    }
    */
      /*

      badRooms = [];

      */

/*
      if (this.memory.scoutRoom == null || this.memory.scoutTarget == null || this.memory.scoutRoom == this.room.name) {
        this.getNewScoutRoom();
      }
      else {
      */
        /*
        if(!this.customMoveByPath(this.memory.pathSaved)){
          /*
          var badRooms = this.memory.badRooms;
          badRooms = [];
          if(badRooms == null){
            badRooms = [];
          }
          badRooms.push(this.memory.scoutRoom);
          */
          //this.memory.badRooms = badRooms;
          ///this.memory.scoutRoom = null;
          //this.memory.scoutTarget = null;
          //this.memory.pathSaved = null;
          //this.getNewScoutRoom();
        ///}

        //this.customPathFinder(this.memory.scoutTarget, 50, null)
        //this.customMove(, null);
        //console.log('MoveIssues: ');
        //this.getNewScoutRoom();
      //}
      //

      //}
      //this.say('S ' + this.memory.scoutRoom);
    },
    Creep.prototype.getNewScoutRoom = function () {
      require('prototype.Creep')();
      //console.log('newRoom: ' + this.name);
      //TODO: ground the creep
      var room = this.room;
      var roomName = room.name;
      var eastWest = roomName.substring(0, 1);
      var eastWestNumber = roomName.substring(1, 3);
      var northSouth = roomName.substring(3, 4);
      var northSouthNumber = roomName.substring(4, 6)
        //console.log(eastWest + ' ' + eastWestNumber + ' ' + northSouth + ' ' + northSouthNumber);
      var newRoomName;
      var newRoom;
      var scoutRooms = [];
      var badRooms = this.memory.badRooms;
      //console.log('BadRooms: ' + badRooms + badRooms.indexOf(newRoomName));

      /*
      for (var x = -2; x <= 2; x++) {
        for (var y = -2; y <= 2; y++) {
          newRoomName = this.newRoomName(eastWest, parseInt(eastWestNumber, 10) + x, northSouth, parseInt(northSouthNumber, 10) + y);
          newRoom = Memory.rooms[newRoomName];

          //console.log('Room crap: ' +  badRooms.indexOf(newRoomName));
          //if(badRooms != null && badRooms.indexOf(newRoomName) != -1){
        //    console.log('RoomSkipped: ' + newRoomName);
        //    continue;
        //  }

          if (newRoom != null && newRoom.memory != null && Game.time - newRoom.memory.lastOccupied > 6000) {
            scoutRooms.push(newRoomName);
          } else { //no memory
            scoutRooms.push(newRoomName);
          }

        }
      }
      */

      scoutRooms.push('E28S37');
      var scout;
      var scoutRoom;
      var pos;
      for (var i = 0; i < scoutRooms.length; i++) {
        scoutRoom = scoutRooms[i];
        if(Game.map.isRoomProtected(scoutRoom.name) == true){
          console.log('protected room skipped');
          continue;
        }
        if(scoutRoom.memory != null && scoutRoom.memory.defended != null && scoutRoom.memory.defended == false){
          console.log('room is dangerous');
          continue;
        }
        pos = new RoomPosition(25, 25, scoutRoom);
        //console.log('Pos: ' + pos);
        //console.log('this: ' + this);


        console.log('pathTest:' + scoutRoom);
        var goal = {pos:pos, range:50};
        var findPath = this.pathAvoidHostiles(goal, null);
        this.memory.path = findPath.path;
        this.memory.scoutRoom = scoutRoom;
        break;
        /*
        if(findPath == null || findPath.path == null || findPath.path.length < 1){
          continue;
        }
        var path = findPath.path;

        if(this.customMoveByPath(path) == true){
          this.memory.action = 'scout';
          this.memory.scoutRoom = scoutRoom;
          this.memory.scoutTarget = pos;
          this.memory.pathSaved = path;
          break;
        }
        */
      }
    },
    Creep.prototype.newRoomName = function (eastWest, eastWestNumber, northSouth, northSouthNumber) {
      if (eastWestNumber < 1) {
        if (eastWest == 'E') {
          eastWest = 'W'
        } else {
          eastWest = 'E'
        }
        Math.abs(eastWestNumber);
      }
      if (northSouthNumber < 1) {
        if (northSouth == 'N') {
          northSouth = 'S'
        } else {
          northSouth = 'N'
        }
        Math.abs(northSouthNumber);
      }

      newName = eastWest + this.pad(eastWestNumber) + northSouth + this.pad(northSouthNumber);
      //console.log('newName: ' + newName);
      return newName;
    },

    Creep.prototype.pad = function (n) {
      if (n < 10 & n >= 0) return ("0" + n);
      //  if (n < 0 & n > -11) return ("-0" + Math.abs(n));
      return n;
    };

};
