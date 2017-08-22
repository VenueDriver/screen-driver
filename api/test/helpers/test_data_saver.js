'use strict';

const Q = require('q');

const DbHelper = require('../../src/helpers/db_helper');

module.exports = class TestDataSever {

    static saveDefaultSetting() {
        let setting = TestDataSever._generateDefaultSetting();
        return TestDataSever.saveSetting(setting);
    }

    static saveSetting(setting) {
        let params = TestDataSever._buildPutParameters(process.env.SETTINGS_TABLE, setting);
        return TestDataSever._performPutOperation(params);
    }

    static saveSchedule(schedule) {
        let params = TestDataSever._buildPutParameters(process.env.SCHEDULES_TABLE, schedule);
        return TestDataSever._performPutOperation(params);
    }

    static _buildPutParameters(tableName, item) {
        return {
            TableName: tableName,
            Item: item,
        };
    }

    static _generateDefaultSetting() {
        return {
            id: 'setting_id',
            name: 'Setting'
        }
    }

    static _performPutOperation(params, deferred) {
        return DbHelper.putItem(params, deferred);
    }
};

