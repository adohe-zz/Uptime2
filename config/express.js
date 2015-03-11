var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    winston = require('winston'),
    morgan = require('morgan'),
    swig = require('swig'),
    cookieParser = require('cookieParser'),
    cookieSession = require('cookieSession'),
    errorhandler = require('errorhandler');

var env = process.env.NODE_ENV || 'development';

/**
 * Expose
 *
 */
module.exports = function(app, config) {

  // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512
  }));

  // Static file middleware
  app.use(express.static(config.root + '/public'));

  // Use winston on production
  var log;
  if(env !== 'development') {
    log = {
      stream: {
        write: function(message, encoding) {
          winston.info(message);
        }
      }
    };
  } else {
    log = 'dev';
  }

  // Don't log during tests
  // Logging middleware
  if(env !== 'test') app.use(morgan(log));

  // Error handler setting
  if(env === 'development' || env === 'test') {
    app.use(errorhandler());
  }

  // Swig template engine setting
  if(env === 'development' || env === 'test') {
    swig.setDefaults({
      cache: false
    });
  }

  // Set view paths, template engine and default layout
  app.engine('html', swig.renderFile);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');

  // bodyParser should be above session
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer());
  app.use(methodOverride(function(req, res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // CookieParser should be above session
  app.use(cookieParser());
  app.use(cookieSession({
  }));
}
