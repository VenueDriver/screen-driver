import { Component, OnInit } from '@angular/core';
import {SchedulesService} from "./schedules.service";
import {Schedule} from "./entities/schedule";
import {EventTime} from "./entities/event-time";
import {SettingStateHolderService} from "../settings/setting-state-manager/settings-state-holder.service";
import {Setting} from "../settings/entities/setting";

@Component({
    selector: 'schedule-creator',
    templateUrl: 'schedule-creator.component.html',
    styleUrls: ['schedule-creator.component.sass']
})
export class ScheduleCreatorComponent implements OnInit {

    schedule = new Schedule();
    eventTime = new EventTime();

    currentSetting: Setting;

    timeItems: Array<string> = [];
    timePeriods = ['AM', 'PM'];

    constructor(
        private schedulesService: SchedulesService,
        private settingStateHolderService: SettingStateHolderService
    ) {
        this.generateTimeItems();
    }

    ngOnInit() {
        this.subscribeToCurrentSettingUpdate();
    }

    generateTimeItems() {
        for (let i = 1; i <= 12; i++) {
            this.timeItems.push(`${i}:00`, `${i}:30`);
        }
    }

    subscribeToCurrentSettingUpdate() {
        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => this.currentSetting = setting);
    }

    setTime(field: string, time: string) {
        this.eventTime[field] = time;
    }

    performSubmit() {
        this.schedule.settingId = this.currentSetting ? this.currentSetting.id : '';
        this.schedulesService.createSchedule(this.schedule, this.eventTime);
    }

    performCancel() {

    }

}