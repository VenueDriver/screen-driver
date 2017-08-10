const dbHelper = require('./../../helpers/db_helper');
const BulkUpdater = require('./bulk_updater');
const _ = require('lodash');

module.exports = class SettingUtils {

    static getSettingsWithUpdatedConfig(itemIds, resolve, reject) {
        let settingsList = [];
        dbHelper.findAll(process.env.SETTINGS_TABLE)
            .then(settings => {
                _.forEach(settings, s => {
                    let settingToUpdate = SettingUtils._deleteConfigOfRemovedItems(s, itemIds);
                    if (Object.keys(s.config).length !== Object.keys(settingToUpdate.config).length) {
                        settingsList.push(settingToUpdate);
                    }
                });
                resolve(settingsList);
            });
    }

    static _deleteConfigOfRemovedItems(setting, itemIds) {
        let settingToUpdate = _.cloneDeep(setting);
        _.forEach(itemIds, id => {
            if (!!setting.config[id]) {
                delete settingToUpdate.config[id];
            }
        });
        return settingToUpdate;
    }

    static updateConfigs(itemIds) {
        return new Promise((resolve, reject) => SettingUtils.getSettingsWithUpdatedConfig(itemIds, resolve, reject))
            .then(settingsToUpdate => {
                if (settingsToUpdate.length > 0) {
                    return BulkUpdater.performBulkUpdate(settingsToUpdate);
                }
                return new Promise((resolve) => resolve());
            });
    }
};