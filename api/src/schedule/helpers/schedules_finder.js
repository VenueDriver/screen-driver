'use strict';

const dbHelper = require('../../helpers/db_helper');
const _ = require('lodash');

module.exports = class SchedulesFinder {

    static findAllEnabledByOneSettingId(settingId) {
        let params = {
            TableName: process.env.SCHEDULES_TABLE,
            ExpressionAttributeValues: {
                ':settingId': settingId,
                ':enabled': true
            },
            FilterExpression: 'settingId = :settingId AND enabled = :enabled'
        };
        return dbHelper.findByParams(params);
    }

    static findAllEnabledBySettingIds(settingIds) {
        let params = {
            TableName: process.env.SCHEDULES_TABLE,
            ExpressionAttributeValues: {
                ':enabled': true
            },
            FilterExpression: 'enabled = :enabled'
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