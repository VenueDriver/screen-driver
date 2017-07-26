import { Component, OnInit } from '@angular/core';
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";
import {Setting} from "../entities/setting";

@Component({
    selector: 'setting-header',
    templateUrl: 'setting-header.component.html',
    styleUrls: ['setting-header.component.sass']
})
export class SettingHeaderComponent implements OnInit {

    setting: Setting;
    isEditSettingMode = false;

    constructor(private settingStateHolderService: SettingStateHolderService) { }

    ngOnInit() {
        this.subscribeToCurrentSettingUpdate();
    }

    subscribeToCurrentSettingUpdate() {
        this.settingStateHolderService.getCurrentSetting().subscribe(setting => {
            this.setting = setting;
        });
    }

    isAllowToEditSetting(): boolean {
        return this.isExistingSetting() && !this.isEditSettingMode;
    }

    activateEditMode() {
        if (this.isAllowToEditSetting()) {
            this.isEditSettingMode = true;
        }
    }

    toggleEditSettingMode() {
        this.isEditSettingMode = !this.isEditSettingMode;
    }

    private isExistingSetting() {
        return this.setting && this.setting.name;
    }

    getPageTitle() {
        return this.isExistingSetting() ? this.setting.name : 'Merged setting';
    }

    showInfoMessage(): boolean {
        return this.setting ? !this.setting.id : true;
    }

    isSettingDisabled(setting: Setting): boolean {
        return setting ? !setting.enabled : false;
    }
}