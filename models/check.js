var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Check = new Schema({
  name          : String,
  type          : String,
  url           : String,
  interval      : { type: Number, default: 60000  },
  timeout       : { type: Number, default:  1500  },
  alertTreshold :  { type: Number, default:  1  },
  errorCount    : { type: Number, default: 0  },
  tags          : [String],
  lastChanged   : Date,
  firstTested   : Date,
  lastTested    : Date,
  isUp          : Boolean,
  isPaused      : { type: Boolean, default: false },
  uptime        : { type: Number, default:  0 },
  downtime      : { type: Number, default: 0  },
  pollerParams  : Schema.Types.Mixed
});

Check.methods.needsPoll = function() {
  if(this.isPaused) return false;
  if(!this.firstTested) return true;

  var delay = (this.lastTested.getTime() - this.firstTested.getTime()) % this.interval;
  return (Date.now() - this.lastTested.getTime() + delay) >= (this.interval || 60000);
}

Check.methods.mustNotifyEvent = function(status) {
  if(!this.firstTested) {
    return true;
  }

  if(!status) {
    // check is down
    if(this.isUp != status) {
      // checks goes down for the first time
      this.errorCount = 1;
    }
    if(this.errorCount < this.alertTreshold) {
      // repeated down pings - increase error count until reaching the down alert treshold
      this.errorCount ++;
      return false;
    }
    if(this.errorCount === this.alertTreshold) {
      // enough down pings to trigger notification
      return true;
    }
    return false;
  }

  // check is up
  if(this.isUp != status && this.errorCount > this.alertTreshold) {
    // checks goes up after reaching the down alert treshold before
    return true;
  }

  return false;
}

/**
 * Increase error count to disable notification if the next ping
 * has the same status.
 */
Check.methods.markEventNotified = function() {
  this.errorCount = this.alertTreshold + 1;
}
