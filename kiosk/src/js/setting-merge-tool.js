class SettingMergeTool {

    constructor(settingMergeTool) {
        if (settingMergeTool) {
            this.settings = settingMergeTool.settings;
            this.priorities = settingMergeTool.priorities;
        }
    }

    mergeSettings() {
        let mergedSetting = {config: {}};
        let enabledSettings = [];
        let forciblyEnabledSettings = [];
        if (this.settings) {
            enabledSettings = this.settings.filter((setting => setting.enabled));
            forciblyEnabledSettings = this.settings.filter((setting => setting.forciblyEnabled));
        }

        enabledSettings.forEach(setting => {
            let priorityIndex = SettingMergeTool.getPriorityIndex(setting.priority, this.priorities);
            if (priorityIndex === 0) {
                this.includeEnabledSettings(setting, mergedSetting);
            }
        });

        forciblyEnabledSettings.forEach(setting => {
            this.includeForciblyEnabledSettings(setting, mergedSetting)
        });
        mergedSetting.enabled = true;
        return mergedSetting;
    }

    includeEnabledSettings(setting, mergedSetting) {
        for (let instruction in setting.config) {
            if (mergedSetting.config.hasOwnProperty(instruction)) {
                mergedSetting.config[instruction] = this.resolveSettingConflict(instruction)
            } else {
                mergedSetting.config[instruction] = setting.config[instruction];
            }
        }
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

    includeForciblyEnabledSettings(setting, mergedSetting) {
        for (let instruction in setting.config) {
            mergedSetting.config[instruction] = setting.config[instruction];
        }
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
