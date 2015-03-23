var util = require('util'),
    dgram = require('dgram'),
    BasePoller = require('../basePoller');

/**
 * UdpServer Singleton, using self-redefining function
 */
var getUdpServer = function() {
  var udpServer = dgram.createSocket('udp4');
  // binding required for getting responses
  udpServer.bind();
  udpServer.on('error', function () {});
  getUdpServer = function() {
    return udpServer;
  };
  return getUdpServer();
};

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

UdpPoller.validate = function(target){
  var reg = new RegExp('udp:\/\/(.*):(\\d{1,5})');
  return reg.test(target);
}

/*
 * Expose
 */
module.exports = UdpPoller;
