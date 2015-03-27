var mongoose = require('mongoose'),
    config = require('config');

var connect = function(){
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.mongodb.connectionString || 'mongodb://' + config.mongodb.user + ':' + config.mongodb.password
    + '@' + config.mongodb.server + '/' + config.mongodb.database, options);
}

connect();

mongoose.connection.on('error', function(err){
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application');
  process.exit(1);
});

// Enable auth
mongoose.connection.on('open', function(err){
  mongoose.connection.db.admin().serverStatus(function(err, data) {
    if(err) {
      if(err.name === 'MongoError' && (err.errmsg === 'need to login' || err.errmsg === 'unauthorized') && !config.mongodb.connectionString) {
        console.log('Forcing MongoDB authentication');
        mongoose.connection.db.authenticate(config.mongodb.user, config.mongodb.password, function(err) {
          if(!err) {
            return;
          }
          console.error(err);
          process.exit(1);
        });
        return;
      } else {
        console.error(err);
        process.exit(1);
      }
    }
  });
});

// Re-connect when connection disconnected
mongoose.connection.on('disconnected', connect);

/*
 * Expose
 */
module.exports = mongoose;
