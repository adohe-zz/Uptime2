var PollerCollection = function(pollers) {
    this.pollers = {};
    this.addDefaultPollers();
}

PollerCollection.prototype.addDefaultPollers = function() {
    this.add(require('./http/httpPoller'));
    this.add(require('./https/httpsPoller'));
}

PollerCollection.prototype.add = function(poller) {
    this.pollers[poller.type] = poller;
}

PollerCollection.prototype.getForType = function(type) {
    if(typeof type === 'string'){
        if(typeof this.pollers[type] === 'undefined'){
            throw new Error('Undefined poller type: ' + type);
        }

        return this.pollers[type];
    }
}

PollerCollection.prototype.getTypes = function() {
    return Object.keys(this.pollers);
}

module.exports = PollerCollection;
