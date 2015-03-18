var util = require('util'),
    tcp = require('tcp'),
    BasePoller = require('../basePoller');

/**
 * TCP Poller, to check TCP Services
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Timeout in millseconds.
 * @param {Function} Error/Success callback
 * @api public
 */
function TcpPoller(target, timeout, callback){
  TcpPoller.super_.call(this, target, timeout, callback);
}

util.inherits(TcpPoller, BasePoller);

TcpPoller.type = 'tcp';

TcpPoller.validate = function(target){
}
