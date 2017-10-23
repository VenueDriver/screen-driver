'use strict';

const _ = require('lodash');
const ScreenUpdateScheduleUtils = require('./../helpers/screen_update_schedule_utils');


class ScreenUpdateSchedule {
    constructor(screenUpdateSchedule) {
        this.id = screenUpdateSchedule.id;
        this.eventTime = screenUpdateSchedule.eventTime;

        this.isEnabled = screenUpdateSchedule.isEnabled == undefined ? true : screenUpdateSchedule.isEnabled;
        this._rev = screenUpdateSchedule._rev == undefined ? 0 : screenUpdateSchedule._rev;
    }

    put() {
        this.validate();
        return ScreenUpdateScheduleUtils.put(this);
    }

    validate() {
        if (_.isEmpty(this.id)) throw new Error('Missed identificator');
        if (_.isEmpty(this.eventTime)) throw new Error('Missed update time');
    }
}

module.exports = ScreenUpdateSchedule;
