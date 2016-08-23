module.exports = {
  mainLoop: function (cpuLog) {
    require('prototype.Flag')();
    try {
      for (var i in Game.flags) {

        var flag = Game.flags[i];
        flag.initialize();
        //flag.remove();

      }
    } catch (err) {
      console.log('Flags Error: ' + err + ' stackTrace: ' + err.stack);
    }
  }
}
