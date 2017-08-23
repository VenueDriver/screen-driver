'use strict';

const dbHelper = require('../../helpers/db_helper');
const _ = require('lodash');

module.exports = class SchedulesFinder {

    static findAllByOneSettingId(settingId) {
        let params = {
            TableName: process.env.SCHEDULES_TABLE,
            ExpressionAttributeValues: {
                ':settingId': settingId
            },
            FilterExpression: 'settingId = :settingId'
        };
        return dbHelper.findByParams(params);
    }

    static findAllBySettingIds(settingIds) {
        let params = {
            TableName: process.env.SCHEDULES_TABLE
        };
        return dbHelper.findByParams(params)
            .then(schedules => {
                return new Promise((resolve, reject) => {
                    resolve(SchedulesFinder._filterSchedulesBySettingIds(schedules, settingIds));
                });
            });
    }

    static _filterSchedulesBySettingIds(schedules, settingIds) {
        return _.filter(schedules, s => _.includes(settingIds, s.settingId));
    }
};