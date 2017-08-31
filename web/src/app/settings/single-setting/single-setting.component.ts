import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingsService} from "../settings.service";
import {NotificationService} from "../../notifications/notification.service";

import * as _ from 'lodash';
import {SchedulesService} from "../../schedules/schedules.service";
import {Schedule} from "../../schedules/entities/schedule";
import {PriorityTypes} from "../../enums/priorty-types";
import {VenuesTreeViewService} from "../../venues/venues-tree-view/venues-tree-view.service";
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";

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
                private schedulesService: SchedulesService,
                private treeViewService: VenuesTreeViewService,
                private settingStateHolderService: SettingStateHolderService,) {
    }

    ngOnInit() {
        this.schedulesService.schedules.subscribe(schedules => this.schedules = this.findSchedules(schedules));
    }

    onToggleClick(event: any) {
        event.stopPropagation();
    }

    changeSettingState(state: boolean) {
        this.setting.enabled = state;
        this.settingsService.updateSetting(this.setting, 'Setting state was changed successfully', 'Unable to change setting state')
            .subscribe(
                response => this.update.emit(),
                error => this.handleChangeStateError()
            );
    }

    handleChangeStateError() {
        let activeSettingId = this.activeSetting ? this.activeSetting.id : null;
        this.settingStateHolderService.reloadSettings(activeSettingId);
    }

    onEnableForciblyClicked(event) {
        event.stopPropagation();
        if (this.isSettingInEditMode()) {
            return;
        }
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
        if (this.isPersistent()) {
            return !_.isEmpty(this.setting.config);
        }
        return !_.isEmpty(this.setting.config)
            && this.hasActiveSchedules();
    }

    findSchedules(schedules: Schedule[]) {
        return schedules.filter(schedule => schedule.settingId === this.setting.id)
    }

    getMessage() {
        if (_.isEmpty(this.setting.config) && !this.hasActiveSchedules() && !this.isPersistent()) {
            return 'Without config and schedule';
        }

        if (!this.hasActiveSchedules() && !this.isPersistent()) {
            return 'Without schedule';
        }

        if (_.isEmpty(this.setting.config)) {
            return 'Without config';
        }
    }

    private hasActiveSchedules(): boolean {
        if (_.isEmpty(this.schedules)) return false;
        return this.schedules.filter(s => s.enabled).length > 0
    }

    private isPersistent() {
        return this.setting.priority === PriorityTypes.PERSISTENT.id;
    }

    isSettingInEditMode(): boolean {
        return this.treeViewService.isTreeEdited()
            && !!this.activeSetting
            && this.setting.id === this.activeSetting.id;
    }

    getForciblyEnabledButtonHint() {
        return this.isSettingInEditMode() ? 'You can\'t do it, when edit the setting' : '';
    }
}
