'use strict';

const DbHelper = require('../../src/helpers/db_helper');
const SettingDataPreparationHelper = require('./setting_data_preparation_helper');
const ScheduleDataPreparationHelper = require('./schedule_data_preparation_helper');

module.exports = class TestDataSever {

    static savePeriodicalSettingsWithSchedules(cronExpressions, config) {
        let existingSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning Menu', config);

        let newSetting;
        return TestDataSever.saveSetting(existingSetting)
            .then(setting => {
                existingSetting = setting;
                let schedule = ScheduleDataPreparationHelper
                    .createRepeatableSchedule(cronExpressions.existingEventCron, cronExpressions.existingEndEventCron, setting.id);
                return TestDataSever.saveSchedule(schedule);
            })
            .then(() => {
                let newSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', {});
                return TestDataSever.saveSetting(newSetting);
            })
            .then(setting => {
                newSetting = setting;
                let schedule = ScheduleDataPreparationHelper
                    .createRepeatableSchedule(cronExpressions.newEventCron, cronExpressions.newEndEventCron, setting.id);
                return TestDataSever.saveSchedule(schedule);
            })
            .then(() => new Promise((resolve, reject) => resolve(newSetting)));
    }

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

