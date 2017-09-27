'use strict';

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
        this.lastUserActionTime = timestamp;
    }

    getLastUserActionTime() {
        return this.lastUserActionTime;
    }

    isUserInteractWithScreen() {
        return (new Date() - userActivityTimeMilliseconds) < this.lastUserActionTime;
    }
}

module.exports = UserInteractionsManager;
