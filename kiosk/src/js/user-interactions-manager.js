'use strict';
const cron = require('node-cron');

let instance = null;

let userActivityTimeMinutes = 1;
let userActivityTimeMilliseconds = userActivityTimeMinutes * 60 * 1000;

class UserInteractionsManager {

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    setLastUserActionTime(timestamp) {
        this.lastUserActionTime = new Date(timestamp);
    }

    getLastUserActionTime() {
        return this.lastUserActionTime;
    }

    isUserInteractWithScreen() {
        return (new Date() - userActivityTimeMilliseconds) < this.lastUserActionTime.getTime();
    }

    applyAfter(callback) {
        if (this.isUserInteractWithScreen()) {
            this._delayAction(callback);
        } else {
            callback();
        }
    }

    _delayAction(callback) {
        let cronJob = cron.schedule('* * * * * *', () => {
            if (!this.isUserInteractWithScreen()) {
                cronJob.destroy();
                callback();
            }
        }, true);
    }
}

module.exports = new UserInteractionsManager();
