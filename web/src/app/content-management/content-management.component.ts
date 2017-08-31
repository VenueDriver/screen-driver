import {Component, OnInit} from '@angular/core';
import {SettingsService} from "../settings/settings.service";

@Component({
    selector: 'content-management',
    templateUrl: './content-management.component.html',
    styleUrls: ['./content-management.component.sass']
})
export class ContentManagementComponent implements OnInit {

    isCreateSettingMode: boolean;

    constructor(private settingsService: SettingsService) {
    }

    ngOnInit() {
        this.settingsService.getCreateSettingEventSubscription()
            .subscribe(params => this.isCreateSettingMode = params.isEnabled);
        this.isCreateSettingMode = false;
    }

}
