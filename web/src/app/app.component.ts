import {Component, OnInit} from '@angular/core';
import {SettingsService} from "./settings/settings.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

    title = 'app';
    isCreateSettingMode: boolean;

    constructor(private settingsService: SettingsService) {}

    ngOnInit() {
        this.settingsService.getCreateSettingEventSubscription()
            .subscribe(params => this.isCreateSettingMode = params.isEnabled);
        this.isCreateSettingMode = false;
    }
}
