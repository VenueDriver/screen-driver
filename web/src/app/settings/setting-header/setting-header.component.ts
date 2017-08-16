import { Component, OnInit } from '@angular/core';
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";
import {Setting} from "../entities/setting";
import {SettingsService} from "../settings.service";

@Component({
    selector: 'setting-header',
    templateUrl: 'setting-header.component.html',
    styleUrls: ['setting-header.component.sass']
})
export class SettingHeaderComponent implements OnInit {

    setting: Setting;
    settings: Setting[];
    isEditSettingMode = false;
    isCreateSettingMode: boolean;

    constructor(
        private settingStateHolderService: SettingStateHolderService,
        private settingsService: SettingsService
    ) { }

    ngOnInit() {
        this.subscribeToSettingsUpdate();
        this.subscribeToCurrentSettingUpdate();
        this.subscribeToSettingCreateEvent();
        this.isCreateSettingMode = false;
    }

    subscribeToSettingsUpdate() {
        this.settingStateHolderService.getAllSettings()
            .subscribe(settings => this.settings = settings);
    }

    subscribeToCurrentSettingUpdate() {
        this.settingStateHolderService.getCurrentSetting().subscribe(setting => {
            this.setting = setting;
        });
    }

    subscribeToSettingCreateEvent() {
        this.settingsService.getCreateSettingEventSubscription()
            .subscribe(params => this.isCreateSettingMode = params.isEnabled);
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

    toggleCreateSettingMode() {
        this.settingsService.emitCreateSettingEvent(false);
    }
}