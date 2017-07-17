import {Configuration} from "../configurations/entities/configuration";

export class SettingMergeTool {
    private settings;
    private priorities;


    constructor(settingMergeTool?) {
        if (settingMergeTool) {
            this.settings = settingMergeTool.settings;
            this.priorities = settingMergeTool.priorities;
        }
    }


    public mergeConfigurations() {
        let mergedConfig = new Configuration();
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

    private resolveSettingConflict(instruction) {
        let conflictedSettings = this.settings.filter(setting => setting.enabled && setting.config.hasOwnProperty(instruction));
        let prioritySetting = this.getMostPrioritySetting(conflictedSettings);
        return prioritySetting.config[instruction];
    }

    private getMostPrioritySetting(conflictedSettings: Configuration[]) {
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

    private getPriorityIndex(priorityId) {
        let priorities = this.priorities;
        let priority = priorities.find(element => element.id == priorityId);
        return priorities.indexOf(priority);
    }

    static startMerging() {
        return new SettingMergeTool();
    }

    public setSettings(settings) {
        this.settings = settings;
        return new SettingMergeTool(this);
    }

    public setPriorities(priorities) {
        this.priorities = priorities;
        return new SettingMergeTool(this);
    }
}
