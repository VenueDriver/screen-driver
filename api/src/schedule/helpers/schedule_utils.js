'use strict';

const Q = require('q');

const db = require('./../../dynamodb/dynamodb');
const dbHelper = require('./../../helpers/db_helper');
const _ = require('lodash');
const Schedule = require('./../entities/schedule');

module.exports = class ScheduleUtils {

    static deleteSchedulesForSetting(settingId) {
        dbHelper.findAll(process.env.SCHEDULES_TABLE)
            .then(schedules => {
                let schedulesForSetting = schedules.filter(schedule => {
                    return schedule.settingId === settingId
                });
                return Q.all(schedulesForSetting.map(schedule => {
                    return new Schedule(schedule, db).deleteSchedule()
                }));
            })
    }
};
