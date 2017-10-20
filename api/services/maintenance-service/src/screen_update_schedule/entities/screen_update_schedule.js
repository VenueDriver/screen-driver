'use strict';


class ScreenUpdateSchedule {
    constructor(screenUpdateSchedule) {
        this.id = screenUpdateSchedule.id;
        this.eventTime = screenUpdateSchedule.eventTime;

        this.isEnabled = screenUpdateSchedule.isEnabled != undefined ? 0 : screenUpdateSchedule.isEnabled;
        this._rev = screenUpdateSchedule._rev != undefined ? 0 : screenUpdateSchedule._rev;
    }

}

module.exports = ScreenUpdateSchedule;
