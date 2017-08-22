'use strict';

const dbHelper = require('../../helpers/db_helper');

module.exports = class SchedulesFinder {

    static findOneBySettingId(settingId) {
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
            TableName: process.env.SCHEDULES_TABLE,
            ExpressionAttributeValues: {
                ':settingIds': settingIds
            },
            FilterExpression: 'settingId IN (:settingIds)'
        };
        return dbHelper.findByParams(params);
    }
};