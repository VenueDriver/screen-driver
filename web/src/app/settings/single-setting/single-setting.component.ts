import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingsService} from "../settings.service";
import {NotificationService} from "../../notifications/notification.service";

@Component({
    selector: 'single-setting',
    templateUrl: './single-setting.component.html',
    styleUrls: ['./single-setting.component.sass']
})
export class SingleSettingComponent {
    @Input() setting: Setting;
    @Input() activeSetting: Setting;
    @Output() update = new EventEmitter();

    constructor(private settingsService: SettingsService,
                private notificationService: NotificationService) {
    }

    onToggleClick(event: any) {
        event.stopPropagation();
    }

    changeSettingState(setting: Setting, state: boolean) {
        setting.enabled = state;
        this.settingsService.updateSetting(setting)
            .subscribe(
                response => this.update.emit(),
                error => this.notificationService.showErrorNotificationBar('Unable to change setting state')
            );
    }

}
