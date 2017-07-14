import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ConfigurationsService} from "../configurations.service";
import {Configuration} from "../entities/configuration";
import {NotificationService} from "../../notifications/notification.service";

@Component({
    selector: 'configuration-creator',
    templateUrl: 'configuration-creator.component.html'
})
export class ConfigurationCreatorComponent implements OnInit {

    @Output() created = new EventEmitter();
    @Output() cancel = new EventEmitter();

    config = new Configuration();

    constructor(
        private configsService: ConfigurationsService,
        private notificationService: NotificationService) { }

    ngOnInit() { }

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
}