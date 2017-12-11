import {Component, OnInit} from '@angular/core';
import {SettingsService} from "../settings/settings.service";
import {SettingStateHolderService} from "../core/setting-state-manager/settings-state-holder.service";
import {Setting} from "../settings/entities/setting";
import {PriorityTypes} from "../core/enums/priorty-types";

@Component({
    selector: 'content-management',
    templateUrl: './content-management.component.html',
    styleUrls: ['./content-management.component.sass']
})
export class ContentManagementComponent implements OnInit {

    isCreateSettingMode: boolean;
    currentSetting: Setting;

    constructor(private settingsService: SettingsService,
                private settingStateHolderService: SettingStateHolderService) {
    }

    ngOnInit() {
        this.settingsService.getCreateSettingEventSubscription()
            .subscribe(params => this.isCreateSettingMode = params.isEnabled);
        this.isCreateSettingMode = false;

        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => this.currentSetting = setting)
    }

    isSchedulesTabDisabled(): boolean {
        return this.currentSetting ? this.currentSetting.priority === PriorityTypes.PERSISTENT.id : false;
    }
}
