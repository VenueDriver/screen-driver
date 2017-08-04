import { Injectable } from '@angular/core';
import {SettingsService} from "./settings.service";
import {SettingStateHolderService} from "./setting-state-manager/settings-state-holder.service";
import {Setting} from "./entities/setting";
import {Schedule} from "../schedules/entities/schedule";
import {Periodicity} from '../enums/periodicity';

import * as _ from 'lodash';

@Injectable()
export class SettingsPriorityHelper {

    constructor(
        private settingsService: SettingsService,
        private settingStateHolderService: SettingStateHolderService
    ) { }

    setPriorityType(setting: Setting, schedule: Schedule) {
        switch (Periodicity[schedule.periodicity]) {
            case Periodicity.ONE_TIME_EVENT:
                this.setPriorityTypeByIndex(setting, 2);
                break;
            case Periodicity.WEEKLY:
                this.setPriorityTypeByIndex(setting, 1);
                break;
        }
    }

    private setPriorityTypeByIndex(setting: Setting, priorityTypeIndex: number) {
        let priorityTypes = this.settingStateHolderService.getPriorityTypes();
        if (this.getPriorityTypeIndex(priorityTypes, setting.priority) < priorityTypeIndex) {
            setting.priority = priorityTypes[priorityTypeIndex].id;
            this.updateSetting(setting);
        }
    }

    private updateSetting(setting: Setting) {
        this.settingsService.updateSetting(setting)
            .subscribe(() => this.settingStateHolderService.reloadSettings(setting.id));
    }

    private getPriorityTypeIndex(priorityTypes: any, priorityId: any): number {
        let priority = _.find(priorityTypes, t => t.id === priorityId);
        return priorityTypes.indexOf(priority);
    }

}