class SettingMergeTool {

    constructor(settingMergeTool) {
        if (settingMergeTool) {
            this.settings = settingMergeTool.settings;
            this.priorities = settingMergeTool.priorities;
        }
    }

    mergeConfigurations() {
        let mergedConfig = {config: {}};
        let enabledSettings = this.settings.filter((setting => setting.enabled));

        enabledSettings.forEach(setting => {
            for (let instruction in setting.config) {
                if (mergedConfig.config.hasOwnProperty(instruction)) {
                    mergedConfig.config[instruction] = this.resolveSettingConflict(instruction)
                } else {
                    mergedConfig.config[instruction] = setting.config[instruction];
                }
            }
        });
        return mergedConfig;
    }

    resolveSettingConflict(instruction) {
        let conflictedSettings = this.settings.filter(setting => setting.enabled && setting.config.hasOwnProperty(instruction));
        let prioritySetting = this.getMostPrioritySetting(conflictedSettings);
        return prioritySetting.config[instruction];
    }

    getMostPrioritySetting(conflictedSettings) {
        let theMostPrioritySetting = null;
        conflictedSettings.forEach(setting => {
            if (!theMostPrioritySetting) {
                theMostPrioritySetting = setting;
                return;
            }

            let settingPriority = this.getPriorityIndex(setting.priority);
            let priorityIndex = this.getPriorityIndex(theMostPrioritySetting.priority);
            if (settingPriority > priorityIndex) {
                theMostPrioritySetting = setting;
            }
        });

        return theMostPrioritySetting;

    }

    getPriorityIndex(priorityId) {
        let priorities = this.priorities;
        let priority = priorities.find(element => element.id == priorityId);
        return priorities.indexOf(priority);
    }

    static startMerging() {
        return new SettingMergeTool();
    }

    setSettings(settings) {
        this.settings = settings;
        return new SettingMergeTool(this);
    }

    setPriorities(priorities) {
        this.priorities = priorities;
        return new SettingMergeTool(this);
    }
}

module.exports = SettingMergeTool;
