const SettingMergeTool = require('./setting-merge-tool');

class ScheduleMergeTool {

    static merge(serverData, locationId) {
        let settings = serverData.originalSettings;
        let schedules = serverData.schedules;
        let priorityTypes = serverData.priorityTypes;

        let settingsForLocation = this.getSettingsForScreen(locationId, settings);
        let enabledSetting = this.getMostPriorityEnabledSetting(settingsForLocation, priorityTypes);

        if (enabledSetting) {
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

    static getSettingsForScreen(locationId, settings) {
        return settings.filter(setting => !!setting.config[locationId])
    }

    static getMostPriorityEnabledSetting(settings, priorityTypes) {
        let filteredSettings = settings.filter(setting => setting.enabled && _isNotPersistent(setting));
        return SettingMergeTool.getMostPrioritySetting(filteredSettings, priorityTypes);

        function _isNotPersistent(setting) {
            return priorityTypes[0].id != setting.priority;
        }
    }
}

module.exports = ScheduleMergeTool;
