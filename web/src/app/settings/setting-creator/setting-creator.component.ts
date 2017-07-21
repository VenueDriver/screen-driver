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
    @Input() settingToEdit: Setting;

    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter();

    setting: Setting;
    isInputValid = true;
    priorityTypes = [];

    constructor(
        private settingsService: SettingsService,
        private notificationService: NotificationService,
        private settingStateHolderService: SettingStateHolderService
    ) { }

    ngOnInit() {
        this.priorityTypes = this.settingStateHolderService.getPriorityTypes();
        this.setting = this.settingToEdit ? _.clone(this.settingToEdit) : new Setting();
        this.subscribeOnCurrentSettingUpdate();
    }

    subscribeOnCurrentSettingUpdate() {
        let configUpdateSubscription = this.settingStateHolderService.getCurrentSetting().subscribe(() => {
            configUpdateSubscription.unsubscribe();
            this.performCancel();
        });
    }

    performSubmit() {
        if (this.settingToEdit) {
            this.updateSetting();
        } else {
            this.createSetting();
        }
    }

    private createSetting() {
        this.settingsService.createSetting(this.setting).subscribe(
            response => this.handleResponse(),
            error => this.handleError()
        );
    }

    private updateSetting() {
        this.settingsService.updateSetting(this.setting).subscribe(
            response => this.handleResponse(),
            error => this.handleError()
        )
    }

    handleResponse() {
        this.settingStateHolderService.reloadSettings();
        this.submit.emit();
    }

    handleError() {
        this.notificationService.showErrorNotificationBar(`Unable to create setting`);
    }

    performCancel() {
        this.cancel.emit();
    }

    prioritySelected(priorityType) {
        this.setting.priority = priorityType.id;
    }

    validateSettingName() {
        this.setting.name = this.setting.name.trim();
        this.isInputValid = !_.find(this.settings, s => s.name === this.setting.name);
    }

    isButtonEnabled(): boolean {
        return !_.isEmpty(this.setting.name) && this.isInputValid;
    }

    getPriorityToEdit() {
        return this.settingToEdit ? this.settingToEdit.priority : null;
    }
}