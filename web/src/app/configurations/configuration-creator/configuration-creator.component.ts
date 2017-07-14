import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ConfigurationsService} from "../configurations.service";
import {Configuration} from "../entities/configuration";
import {NotificationService} from "../../notifications/notification.service";
import {ConfigStateHolderService} from "../configuration-state-manager/config-state-holder.service";

@Component({
    selector: 'configuration-creator',
    templateUrl: 'configuration-creator.component.html',
    styleUrls: ['configuration-creator.component.sass']
})
export class ConfigurationCreatorComponent implements OnInit {

    @Output() created = new EventEmitter();
    @Output() cancel = new EventEmitter();

    config = new Configuration();
    priorityTypes = [];

    constructor(
        private configsService: ConfigurationsService,
        private notificationService: NotificationService,
        private configStateHolderService: ConfigStateHolderService) { }

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
}