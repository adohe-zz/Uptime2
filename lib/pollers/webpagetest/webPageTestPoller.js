var util = require('util'),
    tcp = require('tcp'),
    BasePoller = require('../basePoller');

/**
 * WebPageTest Poller, to do web page test
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Timeout in millseconds.
 * @param {Function} Error/Success callback
 * @api public
 */
function WebPageTestPoller(target, timeout, callback){
  WebPageTestPoller.super_.call(this, target, timeout, callback);
}

util.inherits(WebPageTestPoller, BasePoller);

WebPageTestPoller.type = 'WebPageTest';
