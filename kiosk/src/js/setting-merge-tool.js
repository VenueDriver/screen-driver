class SettingMergeTool {

    constructor(settingMergeTool) {
        if (settingMergeTool) {
            this.settings = settingMergeTool.settings;
            this.priorities = settingMergeTool.priorities;
        }
    }

    mergeSettings() {
        let mergedConfig = {config: {}};
        let enabledSettings = [];
        if (this.settings) {
            enabledSettings = this.settings.filter((setting => setting.enabled));
        }

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
        let conflictedSettings = [];
        if (this.settings) {
            conflictedSettings = this.settings.filter(setting => setting.enabled && setting.config.hasOwnProperty(instruction));
        }
        let prioritySetting = SettingMergeTool.getMostPrioritySetting(conflictedSettings, this.priorities);
        return prioritySetting.config[instruction];
    }

    static getMostPrioritySetting(conflictedSettings, priorities) {
        let theMostPrioritySetting = null;
        conflictedSettings.forEach(setting => {
            if (!theMostPrioritySetting) {
                theMostPrioritySetting = setting;
                return;
            }

            let settingPriority = this.getPriorityIndex(setting.priority, priorities);
            let priorityIndex = this.getPriorityIndex(theMostPrioritySetting.priority, priorities);
            if (settingPriority > priorityIndex) {
                theMostPrioritySetting = setting;
            }
        });

        return theMostPrioritySetting;

    }

    static getPriorityIndex(priorityId, priorities) {
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
