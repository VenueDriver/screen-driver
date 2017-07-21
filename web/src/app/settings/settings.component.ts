import {Component, OnInit} from '@angular/core';
import {Setting} from "./entities/setting";
import {SettingStateHolderService} from "./setting-state-manager/settings-state-holder.service";

@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.sass']
})
export class SettingsComponent implements OnInit {

    settings: Setting[];
    currentSetting: Setting;

    constructor(private settingStateHolderService: SettingStateHolderService) {
    }

    ngOnInit() {
        this.settingStateHolderService.reloadSettings();
        this.settingStateHolderService.getAllSettings().subscribe(settings => this.settings = settings);
        this.settingStateHolderService.getCurrentSetting().subscribe(setting => this.currentSetting = setting);
    }

    handleSettingSelection(setting: Setting) {
        this.settingStateHolderService.changeCurrentSetting(setting);
    }

}
