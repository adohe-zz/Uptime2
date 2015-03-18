var util = require('util'),
    dgram = require('dgram'),
    BasePoller = require('../basePoller');

/**
 * UDP Poller, to check UDP Services
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Timeout in millseconds.
 * @param {Function} Error/Success callback
 * @api public
 */
function UdpPoller(target, timeout, callback){
  UdpPoller.super_.call(this, target, timeout, callback);
}

util.inherits(UdpPoller, BasePoller);

UdpPoller.type = 'udp';
