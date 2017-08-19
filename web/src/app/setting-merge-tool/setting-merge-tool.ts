import {Setting} from "../settings/entities/setting";

export class SettingMergeTool {
    private settings;
    private priorities;


    constructor(settingMergeTool?) {
        if (settingMergeTool) {
            this.settings = settingMergeTool.settings;
            this.priorities = settingMergeTool.priorities;
        }
    }


    public mergeSettings(): Setting {
        let mergedConfig = new Setting();
        let enabledSettings = [];
        let forciblyEnabledSettings = [];
        if (this.settings) {
            enabledSettings = this.settings.filter((setting => setting.enabled));
            forciblyEnabledSettings = this.settings.filter((setting => setting.forciblyEnabled));
        }

        enabledSettings.forEach(setting => {
            this.includeEnabledSettings(setting, mergedConfig);
        });

        forciblyEnabledSettings.forEach(setting => {
            this.includeForciblyEnabledSettings(setting, mergedConfig)
        });
        mergedConfig.enabled = true;
        return mergedConfig;
    }

    private includeEnabledSettings(setting, mergedConfig: Setting) {
        for (let instruction in setting.config) {
            if (mergedConfig.config.hasOwnProperty(instruction)) {
                mergedConfig.config[instruction] = this.resolveSettingConflict(instruction)
            } else {
                mergedConfig.config[instruction] = setting.config[instruction];
            }
        }
    }

    private resolveSettingConflict(instruction): string {
        let conflictedSettings = [];
        if (this.settings) {
            conflictedSettings = this.settings.filter(setting => setting.enabled && setting.config.hasOwnProperty(instruction));
        }
        let prioritySetting = this.getMostPrioritySetting(conflictedSettings);
        return prioritySetting.config[instruction];
    }

    private getMostPrioritySetting(conflictedSettings: Setting[]): Setting {
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

    private getPriorityIndex(priorityId): number {
        let priorities = this.priorities;
        let priority = priorities.find(element => element.id == priorityId);
        return priorities.indexOf(priority);
    }

    private includeForciblyEnabledSettings(setting, mergedConfig: Setting) {
        for (let instruction in setting.config) {
            mergedConfig.config[instruction] = setting.config[instruction];
        }
    }

    static startMerging(): SettingMergeTool {
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
