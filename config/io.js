var env = process.env.NODE_ENV || 'development';

/**
 * Expose
 *
 */
module.exports = function(server, config) {

  var io = require('socket.io')(server);

  io.on('connection', function(socket){
    socket.on('set check', function(check){
      socket.set('check', check);
    });
  });
}
