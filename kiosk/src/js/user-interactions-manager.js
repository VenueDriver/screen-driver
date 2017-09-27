'use strict';
const cron = require('node-cron');

let instance = null;

let userActivityTimeMinutes = 1;
let userActivityTimeMilliseconds = userActivityTimeMinutes * 60 * 1000;

class UserInteractionsManager {

    constructor() {
        if (!instance) {
            instance = this;
            this.queue = [];
            this.isApplyingQueueMode = false;
            this._initQueueWatcher();
        }
        return instance;
    }

    _initQueueWatcher() {
        cron.schedule('* * * * * *', () => {
            if (!this.isUserInteractWithScreen() && this.queue.length != 0 && !this.isApplyingQueueMode) {
                this.isApplyingQueueMode = true;
                this._applyDelayedTasks();
            }
        }, true);
    }

    setLastUserActionTime(timestamp) {
        this.lastUserActionTime = new Date(timestamp);
    }

    getLastUserActionTime() {
        return this.lastUserActionTime;
    }

    isUserInteractWithScreen() {
        if (!this.lastUserActionTime) {
            return false;
        }
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
        this.queue.push(callback);
    }

    _applyDelayedTasks() {
        if (this.queue[0]) {
            let delayedOperationResult = this.queue[0]();
            this.queue.splice(0, 1);

            if (_isPromise(delayedOperationResult)) {
                delayedOperationResult.then(() => this._applyDelayedTasks())
            } else {
                this._applyDelayedTasks();
            }

        } else {
            this.isApplyingQueueMode = false;
        }

    }
}

function _isPromise(object) {
    return !!object.then;
}

module.exports = new UserInteractionsManager();
