const SettingMergeTool = require('./setting-merge-tool');
const SettingsHelper = require('./helpers/settings_helper');
const _ = require('lodash');

class ScheduleMergeTool {

    static merge(serverData, screenInfo) {
        let settings = serverData.originalSettings;
        let schedules = _.filter(serverData.schedules, schedule => schedule.enabled);
        let priorityTypes = serverData.priorityTypes;

        let settingsForCurrentLocation = this.getSettingsForLocation(screenInfo, settings);

        return this.getSchedulesToRun(settingsForCurrentLocation, schedules, priorityTypes);
    }

    static getSettingsForLocation(screenInfo, settings) {
        return _.filter(settings, setting => !!SettingsHelper.defineContentId(setting, screenInfo));
    }

    static getSchedulesToRun(settings, schedules, priorityTypes) {
        let enabledScheduledSettings = _.filter(settings, setting => setting.enabled && _isNotPersistent(setting));
        return _getActiveSchedules();

        function _isNotPersistent(setting) {
            return priorityTypes[0].id != setting.priority;
        }

        function _getActiveSchedules() {
            let activeSchedules = [];
            schedules.forEach(schedule => {
                if (_.find(enabledScheduledSettings, setting => setting.id === schedule.settingId)) {
                    activeSchedules.push(schedule)
                }
            });
            return activeSchedules;
        }
    }
}

module.exports = ScheduleMergeTool;
