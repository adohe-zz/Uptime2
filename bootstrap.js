var mongoose = require('mongoose'),
    config = require('config');

var connect = function(){
  mongoose.connect();
}

connect();

mongoose.connection.on('error', function(err){
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application');
  process.exit(1);
});

// Enable auth
mongoose.connection.on('open', function(err){
});

// Re-connect when connection disconnected
mongoose.connection.on('disconnected', connect);
