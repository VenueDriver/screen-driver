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
}
