import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingsService} from "../settings.service";
import {NotificationService} from "../../notifications/notification.service";

import * as _ from 'lodash';
import {SchedulesService} from "../../schedules/schedules.service";
import {Schedule} from "../../schedules/entities/schedule";

@Component({
    selector: 'single-setting',
    templateUrl: './single-setting.component.html',
    styleUrls: ['./single-setting.component.sass']
})
export class SingleSettingComponent implements OnInit {
    @Input() setting: Setting;
    @Input() activeSetting: Setting;
    @Output() update = new EventEmitter();

    private schedules: Schedule[];

    constructor(private settingsService: SettingsService,
                private notificationService: NotificationService,
                private schedulesService: SchedulesService) {
    }

    ngOnInit() {
        this.schedulesService.schedules.subscribe(schedules => this.schedules = this.findSchedules(schedules));
    }

    onToggleClick(event: any) {
        event.stopPropagation();
    }

    changeSettingState(state: boolean) {
        this.setting.enabled = state;
        this.settingsService.updateSetting(this.setting)
            .subscribe(
                response => this.update.emit(),
                error => this.notificationService.showErrorNotificationBar('Unable to change setting state')
            );
    }

    onEnableForciblyClicked() {
        this.setting.forciblyEnabled = !this.setting.forciblyEnabled;
        this.settingsService.updateSetting(this.setting)
            .subscribe(
                response => this.update.emit(),
                error => this.notificationService.showErrorNotificationBar('Unable to enable setting forcibly')
            );
    }

    isEnabledForcibly() {
        return this.setting.forciblyEnabled;
    }

    isControlButtonsDisplayed() {
        return !_.isEmpty(this.setting.config) && !_.isEmpty(this.schedules);
    }

    findSchedules(schedules: Schedule[]) {
        return schedules.filter(schedule => schedule.settingId === this.setting.id)
    }

    getMessage() {
        if (_.isEmpty(this.setting.config) && _.isEmpty(this.schedules)) {
            return 'Without config and schedule';
        }

        if (_.isEmpty(this.schedules)) {
            return 'Without schedule';
        }

        if (_.isEmpty(this.setting.config)) {
            return 'Without config';
        }
    }
}
