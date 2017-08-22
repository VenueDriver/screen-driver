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
    isRemoveMode: boolean = false;
    priorityTypes = [];

    constructor(
        private settingsService: SettingsService,
        private notificationService: NotificationService,
        private settingStateHolderService: SettingStateHolderService
    ) { }

    ngOnInit() {
        this.priorityTypes = this.settingStateHolderService.getPriorityTypes();
        this.setting = this.settingToEdit ? _.clone(this.settingToEdit) : new Setting();
        this.filterCurrentSetting();
        this.subscribeOnCurrentSettingUpdate();
    }

    filterCurrentSetting() {
        if (this.settingToEdit) {
            this.settings = _.filter(this.settings, s => s.id !== this.settingToEdit.id);
        }
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
        let priorityType = this.settingsService.getCreateSettingLastValue().priorityType;
        this.setting.priority = priorityType.id;
        this.settingsService.createSetting(this.setting).subscribe(
            (setting: Setting) => this.handleResponse(setting.id),
            error => this.handleCreationError()
        );
    }

    private updateSetting() {
        this.settingsService.updateSetting(this.setting).subscribe(
            (setting: Setting) => this.handleResponse(setting.id),
            error => this.handleCreationError()
        )
    }

    handleResponse(currentSettingId?: string) {
        this.settingStateHolderService.reloadSettings(currentSettingId);
        this.submit.emit();
    }

    handleCreationError() {
        this.notificationService.showErrorNotificationBar(`Unable to create setting`);
    }

    handleDeletionError() {
        this.notificationService.showErrorNotificationBar(`Unable to create setting`);
    }

    performCancel() {
        this.cancel.emit();
    }

    validateSettingName() {
        this.setting.name = this.setting.name.trim();
        this.isInputValid = !_.find(this.settings, s => s.name.trim() === this.setting.name);
    }

    isButtonEnabled(): boolean {
        return !_.isEmpty(this.setting.name) && this.isInputValid;
    }

    isCreationMode(): boolean {
        return !this.isEditionMode();
    }

    isEditionMode(): boolean {
        return !!this.settingToEdit;
    }

    enableRemovingMode() {
        this.isRemoveMode = true;
    }

    performRemoving() {
        this.settingStateHolderService.removeSetting(this.settingToEdit.id)
            .subscribe(response => this.settingStateHolderService.reloadSettings(),
            error => this.handleDeletionError());
    }

    cancelRemoving() {
        this.isRemoveMode = false;
    }
}