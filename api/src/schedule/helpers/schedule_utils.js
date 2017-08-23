'use strict';

const dbHelper = require('./../../helpers/db_helper');
const _ = require('lodash');

module.exports = class ScheduleUtils {

    static deleteSchedulesForSetting(settingId) {
        dbHelper.findAll(process.env.SCHEDULES_TABLE)
            .then(schedules => {
                let schedulesForSetting = schedules.filter(schedule => schedule.settingId === settingId);
                return dbHelper.batchDelete(process.env.SCHEDULES_TABLE, schedulesForSetting)
            })
    }
};
