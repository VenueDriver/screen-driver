'use strict';

const dbHelper = require('../../helpers/db_helper');

module.exports = class SettingFinder {

    static findSettingById(settingId) {
        return dbHelper.findOne(process.env.SETTINGS_TABLE, settingId);
    }
};