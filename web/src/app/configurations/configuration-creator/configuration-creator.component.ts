import {Component, Output, EventEmitter, Input} from '@angular/core';
import {ConfigurationsService} from "../configurations.service";
import {Configuration} from "../entities/configuration";
import {NotificationService} from "../../notifications/notification.service";

import * as _ from 'lodash';

@Component({
    selector: 'configuration-creator',
    templateUrl: 'configuration-creator.component.html',
    styleUrls: ['configuration-creator.component.sass']
})
export class ConfigurationCreatorComponent {

    @Input() settings: Configuration[];

    @Output() created = new EventEmitter();
    @Output() cancel = new EventEmitter();

    config = new Configuration();
    isInputValid = true;

    constructor(
        private configsService: ConfigurationsService,
        private notificationService: NotificationService) { }

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

    validateSettingName() {
        this.config.name = this.config.name.trim().toLowerCase();
        this.isInputValid = !_.find(this.settings, s => s.name.toLowerCase() === this.config.name);
    }

    isButtonEnabled(): boolean {
        return !_.isEmpty(this.config.name) && this.isInputValid;
    }
}