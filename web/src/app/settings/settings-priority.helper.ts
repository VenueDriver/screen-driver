import { Injectable } from '@angular/core';
import {SettingsService} from "./settings.service";
import {SettingStateHolderService} from "./setting-state-manager/settings-state-holder.service";
import {Setting} from "./entities/setting";

@Injectable()
export class SettingsPriorityHelper {

    constructor(
        private settingsService: SettingsService,
        private settingStateHolderService: SettingStateHolderService
    ) { }

    setPersistentPriorityType(setting: Setting) {
        let priorityTypes = this.settingStateHolderService.getPriorityTypes();
        if (setting.priority !== priorityTypes[1].id) {
            setting.priority = priorityTypes[1].id;
            this.updateSetting(setting);
        }
    }

    private updateSetting(setting: Setting) {
        this.settingsService.updateSetting(setting)
            .subscribe(() => this.settingStateHolderService.reloadSettings(setting.id));
    }

}