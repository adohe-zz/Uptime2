var util = require('util'),
    url = require('url'),
    http = require('http'),
    BaseHttpPoller = require('./baseHttpPoller');

function HttpPoller(target, timeout, callback) {
}

util.inherits(HttpPoller, BaseHttpPoller);

HttpPoller.type = 'http';

HttpPoller.validateTarget = function(target) {
}


