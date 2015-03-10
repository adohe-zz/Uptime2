var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

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

}
