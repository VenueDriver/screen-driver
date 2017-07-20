import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {SettingsService} from "../settings.service";
import {Setting} from "../entities/setting";
import {NotificationService} from "../../notifications/notification.service";
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";

import * as _ from 'lodash';

@Component({
    selector: 'setting-creator',
    templateUrl: 'setting-creator.component.html',
    styleUrls: ['setting-creator.component.sass']
})
export class SettingCreatorComponent implements OnInit {

    @Input() settings: Setting[];
    @Input() setting: Setting;

    @Output() submitted = new EventEmitter();
    @Output() cancel = new EventEmitter();

    isInputValid = true;
    priorityTypes = [];

    constructor(
        private settingsService: SettingsService,
        private notificationService: NotificationService,
        private settingStateHolderService: SettingStateHolderService) { }

    ngOnInit() {
        this.priorityTypes = this.settingStateHolderService.getPriorityTypes();
        if (!this.setting){
            this.setting = new Setting();
        }
    }

    performSubmit() {
        this.settingsService.createSetting(this.setting).subscribe(
            response => this.handleResponse(),
            error => this.handleError()
        );
    }

    handleResponse() {
        this.submitted.emit();
    }

    handleError() {
        this.notificationService.showErrorNotificationBar(`Unable to create setting`);
    }

    performCancel() {
        this.cancel.emit();
    }

    prioritySelected(priorityType) {
        console.log('priority selected after dropdown emit')
        this.setting.priority = priorityType;
    }

    validateSettingName() {
        this.setting.name = this.setting.name.trim();
        this.isInputValid = !_.find(this.settings, s => s.name === this.setting.name);
    }

    isButtonEnabled(): boolean {
        return !_.isEmpty(this.setting.name) && this.isInputValid;
    }

    getPriorityType() {
        console.log(this.priorityTypes, this.setting.priority)
        return this.priorityTypes.find(type => type.id === this.setting);
    }
}