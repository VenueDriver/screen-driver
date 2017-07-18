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

    @Output() created = new EventEmitter();
    @Output() cancel = new EventEmitter();

    config = new Setting();
    isInputValid = true;
    priorityTypes = [];

    constructor(
        private configsService: SettingsService,
        private notificationService: NotificationService,
        private configStateHolderService: SettingStateHolderService) { }

    ngOnInit() {
        this.priorityTypes = this.configStateHolderService.getPriorityTypes();
    }

    performSubmit() {
        this.configsService.createConfiguration(this.config).subscribe(
            response => this.handleResponse(),
            error => this.handleError()
        );
    }

    handleResponse() {
        this.created.emit();
    }

    handleError() {
        this.notificationService.showErrorNotificationBar(`Unable to create config`);
    }

    performCancel() {
        this.cancel.emit();
    }

    prioritySelected(priorityType) {
        this.config.priority = priorityType;
    }

    validateSettingName() {
        this.config.name = this.config.name.trim();
        this.isInputValid = !_.find(this.settings, s => s.name === this.config.name);
    }

    isButtonEnabled(): boolean {
        return !_.isEmpty(this.config.name) && this.isInputValid;
    }
}