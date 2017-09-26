'use strict';

const dbHelper = require('./../../helpers/db_helper');
const SettingFinder = require('../../setting/helpers/setting_finder');
const ConflictsIdentifier = require('../../setting/helpers/conflicts_identifier');

module.exports = class ScheduleUtils {

    static deleteSchedulesForSetting(settingId) {
        dbHelper.findAll(process.env.SCHEDULES_TABLE)
            .then(schedules => {
                let schedulesForSetting = schedules.filter(schedule => schedule.settingId === settingId);
                return dbHelper.batchDelete(process.env.SCHEDULES_TABLE, schedulesForSetting)
            })
    }

    static findConflicts(schedule) {
        return SettingFinder.findSettingById(schedule.settingId)
            .then(setting => ConflictsIdentifier.findConflicts(setting, [schedule]));
    }
};
