function Timer(timeout, timeoutCallback) {
    this.finalTime = false;
    this.time = Date.now();
    this.TimerFunction = setTimeout(timeout, callback);
}

Timer.prototype.getTime = function(){
    return this.finalTime || Date.now() - this.time;
}

Timer.prototype.stop = function(){
    this.finalTime = this.getTime();
    clearTimeout(this.TimerFunction);
}

/**
 * Expose
 */
exports.createTimer = function(timeout, callback){
    return new Timer(timeout, callback);
}
