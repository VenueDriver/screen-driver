const SettingMergeTool = require('setting-merge-tool');
const SettingsHelper = require('./helpers/settings_helper');
const _ = require('lodash');

class ScheduleMergeTool {

    static merge(serverData, screenInfo) {
        let settings = serverData.originalSettings;
        let schedules = serverData.schedules;
        let priorityTypes = serverData.priorityTypes;

        let settingsForLocation = this.getSettingsForLocation(screenInfo, settings);
        let enabledSetting = this.getMostPriorityEnabledSetting(settingsForLocation, priorityTypes);

        if (!_.isEmpty(enabledSetting)) {
            return enabledSetting;
        }

        this.mergeSettingsWithSchedules(settingsForLocation, schedules);
        let enabledPersistentSetting = settingsForLocation.find(setting => setting.enabled && setting.priority === priorityTypes[0].id);

        return enabledPersistentSetting ? enabledPersistentSetting : SettingMergeTool.getMostPrioritySetting(settingsForLocation, priorityTypes);
    }

    static mergeSettingsWithSchedules(settings, schedules) {
        settings.forEach(setting => {
            setting.schedules = schedules;
        });
    }

    static getSettingsForLocation(screenInfo, settings) {
        return _.filter(settings, setting => !!SettingsHelper.defineContentId(setting, screenInfo));
    }

    static getMostPriorityEnabledSetting(settings, priorityTypes) {
        let filteredSettings = _.filter(settings, setting => setting.enabled && _isNotPersistent(setting));
        return SettingMergeTool.getMostPrioritySetting(filteredSettings, priorityTypes);

        function _isNotPersistent(setting) {
            return priorityTypes[0].id != setting.priority;
        }
    }
}

module.exports = ScheduleMergeTool;
