var util = require('util'),
    url = require('url'),
    BasePoller = require('../basePoller');

function BaseHttpPoller(target, timeout, callback) {
}

util.inherits(BaseHttpPoller, BasePoller);

BaseHttpPoller.prototye.initialize = function() {
  if(typeof(this.target) === 'string') {
    this.target = url.parse(this.target);
  }
}

BaseHttpPoller.prototype.setUserAgent = function(agent){
}
