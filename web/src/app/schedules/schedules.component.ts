import { Component, OnInit } from '@angular/core';
import {SchedulesService} from "./schedules.service";
import {Schedule} from "./entities/schedule";
import {SettingStateHolderService} from "../settings/setting-state-manager/settings-state-holder.service";
import {Setting} from "../settings/entities/setting";

import * as _ from 'lodash';

@Component({
    selector: 'schedules',
    templateUrl: 'schedules.component.html'
})
export class SchedulesComponent implements OnInit {

    schedules: Array<Schedule>;
    filteredSchedules: Array<Schedule>;
    currentSetting: Setting;

    constructor(
        private schedulesService: SchedulesService,
        private settingStateHolderService: SettingStateHolderService
    ) { }

    ngOnInit() {
        this.loadSchedules();
        this.subscribeToCurrentSettingChanging();
    }

    loadSchedules() {
        this.schedulesService.loadSchedules()
            .subscribe(schedules => {
                this.schedules = schedules;
                this.filteredSchedules = schedules;
            });
    }

    subscribeToCurrentSettingChanging() {
        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => {
                this.currentSetting = setting;
                this.filteredSchedules = this.getFilteredSchedules();
            });
    }

    getFilteredSchedules(): Array<Schedule> {
        return _.filter(this.schedules, s => s.settingId === this.currentSetting.id);
    }

}