'use strict';


class ScreenUpdateSchedule {
    constructor(scheduleUpdate) {
        this.id = scheduleUpdate.id;
        this.eventTime = scheduleUpdate.eventTime;

        this.isEnabled = scheduleUpdate.isEnabled != undefined ? 0 : scheduleUpdate.isEnabled;
        this._rev = scheduleUpdate._rev != undefined ? 0 : scheduleUpdate._rev;
    }

}

module.exports = ScreenUpdateSchedule;
