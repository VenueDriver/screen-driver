import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";
import {HeaderService} from "../../header/header.service";
import {SettingsService} from "../settings.service";
import {NotificationService} from "../../notifications/notification.service";

import * as _ from 'lodash';

@Component({
    selector: 'settings-manager',
    templateUrl: 'settings-manager.component.html',
    styleUrls: ['settings-manager.component.sass']
})
export class SettingsManagerComponent implements OnInit {

    @Input() settings: Setting[];
    @Output() settingSelected: EventEmitter<Setting> = new EventEmitter();

    activeSetting: Setting;
    showSidebar = true;

    constructor(private headerService: HeaderService,
                private settingStateHolderService: SettingStateHolderService,
                private settingsService: SettingsService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        if (this.settings) {
            this.activeSetting = this.settings[0];
        }
        this.subscribeOnSidebarToggle();
        this.subscribeOnCurrentSettingChange();
    }

    subscribeOnSidebarToggle() {
        this.headerService.getSideBarToggleSubscription()
            .subscribe(() => this.toggle());
    }

    subscribeOnCurrentSettingChange() {
        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => this.activeSetting = setting);
    }

    toggle() {
        this.showSidebar = !this.showSidebar;
    }

    onSettingSelection(setting: Setting) {
        this.settingSelected.emit(setting);
        this.headerService.pushSidebarToggleEvent();
    }

    isActive(setting: Setting): boolean {
        return this.activeSetting && this.activeSetting.id === setting.id;
    }

    enableCreationMode() {
        this.settingsService.emitCreateSettingEvent(true);
        this.headerService.pushSidebarToggleEvent();
    }

    onToggleClick(event: any) {
        event.stopPropagation();
    }

    changeSettingState(setting: Setting, state: boolean) {
        setting.enabled = state;
        this.settingsService.updateSetting(setting)
            .subscribe(
                response => this.handleUpdateSettingResponse(),
                error => this.notificationService.showErrorNotificationBar('Unable to change setting state')
            );
    }

    handleUpdateSettingResponse() {
        let currentSettingId = this.activeSetting ? this.activeSetting.id : '';
        this.settingStateHolderService.reloadSettings(currentSettingId);
        if (!this.activeSetting) {
            this.showCurrentState();
        }
    }

    showCurrentState() {
        this.settingStateHolderService.changeCurrentSetting();
        this.activeSetting = null;
        this.headerService.pushSidebarToggleEvent();
    }

    getEnabledSettingsCount(): number {
        let enabledSettings = _.filter(this.settings, 'enabled');
        return enabledSettings.length;
    }
}
