/**
 * Dependencies
 */
var express = require('express'),
    partials = require('express-partials'),
    flash = require('connect-flash'),
    errorHandler = require('errorhandler'),
    swig = require('swig');

var env = process.env.NODE_ENV || 'development';

module.exports = function(app){
  // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512
  }));

  // Static file middleware
  app.use(express.static(__dirname + '/public'));

  // Error handler setting
  if(env === 'development') {
    app.use(errorHanlder());
  }

  if(env === 'development' || env === 'test') {
    swig.setDefaults({
      cache: false
    });
  }

  // set views path, template engine and default layout
  app.engine('html', swig.renderFile);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');

  // connect-flash for flash messages
  app.use(flash());
}
