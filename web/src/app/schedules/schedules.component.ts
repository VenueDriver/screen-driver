import {Component, OnInit, Input} from '@angular/core';
import {SchedulesService} from "./schedules.service";
import {Schedule} from "./entities/schedule";
import {SettingStateHolderService} from "../settings/setting-state-manager/settings-state-holder.service";
import {Setting} from "../settings/entities/setting";

import * as _ from 'lodash';

@Component({
    selector: 'schedules',
    templateUrl: 'schedules.component.html',
    styleUrls: ['schedules.component.sass']
})
export class SchedulesComponent implements OnInit {

    schedules: Array<Schedule>;
    filteredSchedules: Array<Schedule>;
    currentSetting: Setting;
    isShowCreateScheduleForm = false;
    settings: Array<Setting>;

    constructor(
        private schedulesService: SchedulesService,
        private settingStateHolderService: SettingStateHolderService
    ) { }

    ngOnInit() {
        this.loadSchedules();
        this.subscribeToCurrentSettingChanging();
        this.schedulesService.scheduleListUpdated.subscribe(() => this.loadSchedules());
        this.loadSettings();
    }

    private loadSettings() {
        this.settingStateHolderService.getAllSettings().subscribe(settings => {
            this.settings = settings;
        });
    }

    loadSchedules() {
        this.schedulesService.loadSchedules()
            .subscribe(schedules => {
                this.schedules = schedules;
                this.filteredSchedules = this.getFilteredSchedules();
                this.hideCreateScheduleForm();
            });
    }

    subscribeToCurrentSettingChanging() {
        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => {
                this.currentSetting = setting;
                this.filteredSchedules = this.getFilteredSchedules();
                this.isShowCreateScheduleForm = this.filteredSchedules.length == 0;
            });
    }

    getFilteredSchedules(): Array<Schedule> {
        if (this.currentSetting) {
            return _.filter(this.schedules, s => s.settingId === this.currentSetting.id);
        }
        return this.schedules;
    }

    isEditable(): boolean {
        return !!this.currentSetting && !!this.currentSetting.id;
    }

    showCreateScheduleForm() {
        this.isShowCreateScheduleForm = true;
    }

    hideCreateScheduleForm() {
        this.isShowCreateScheduleForm = false;
    }

    showAddScheduleButton(): boolean {
        return !this.isShowCreateScheduleForm && !!this.currentSetting && !!this.currentSetting.id
    }

    findSettingForSchedule(schedule: Schedule): Setting {
        return this.settings.find(setting => setting.id === schedule.settingId);
    }
}