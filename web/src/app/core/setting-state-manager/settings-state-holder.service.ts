import {Injectable} from '@angular/core';
import {Setting} from "../../settings/entities/setting";
import {Subject, Observable, BehaviorSubject} from "rxjs";
import {SettingsService} from "../../settings/settings.service";
import {Notification} from "angular2-notifications/dist";

import * as _ from 'lodash';
import {NotificationService} from "../../shared/notifications/notification.service";

@Injectable()
export class SettingStateHolderService {

    private setting: Subject<Setting[]> = new Subject();
    private currentSetting: Subject<Setting> = new Subject();
    private _isSettingInEditMode: Subject<boolean> = new BehaviorSubject(false);
    private priorityTypes: Array<any>;
    private staticNotification: Notification;

    constructor(private settingsService: SettingsService,
                private notificationService: NotificationService,) {
    }

    reloadSettings(currentSettingId?: string) {
        this.settingsService.loadSettings()
            .subscribe(response => {
                let settings = response.settings;
                this.updateSettings(settings);
                this.priorityTypes = response.priorityTypes;
                this.updateCurrentSettingIfSelected(settings, currentSettingId);
                this.checkForWarnings(settings)
            });
    }

    updateCurrentSettingIfSelected(settings: Setting[], currentSettingId: string) {
        if (currentSettingId) {
            let currentSetting = _.find(settings, s => s.id === currentSettingId);
            this.changeCurrentSetting(currentSetting);
        }
    }

    removeSetting(id: string) {
        return this.settingsService.removeSetting(id)
    }

    updateSettings(settings: Setting[]) {
        this.setting.next(settings);
    }

    changeCurrentSetting(setting?: Setting) {
        this.currentSetting.next(setting);
    }

    getAllSettings(): Observable<Setting[]> {
        return this.setting.map(settings => _.sortBy(settings, 'name'));
    }

    getCurrentSetting(): Observable<Setting> {
        return this.currentSetting.asObservable();
    }

    enableCurrentSettingEditMode() {
        this.toggleSettingEditMode(true);
    }

    disableCurrentSettingEditMode() {
        this.toggleSettingEditMode(false);
    }

    private toggleSettingEditMode(editMode: boolean) {
        this._isSettingInEditMode.next(editMode);
    }

    isSettingInEditMode(): Observable<boolean> {
        return this._isSettingInEditMode.asObservable();
    }

    getPriorityTypes(): any[] {
        return this.priorityTypes;
    }

    private checkForWarnings(settings: Setting[]) {
        let forciblyEnabledSettings = settings.filter(setting => setting.forciblyEnabled);
        if (!_.isEmpty(forciblyEnabledSettings)) {
            let message = this.getWarningMessageForSettings(forciblyEnabledSettings);
            this.staticNotification = this.notificationService.showNonVanishingWarning(message);
        } else {
            this.hideNotification();
        }
    }

    hideNotification() {
        if (this.staticNotification) {
            this.notificationService.hide(this.staticNotification.id);
        }
    }

    private getWarningMessageForSettings(forciblyEnabledSettings: Setting[]) {
        let forciblyEnabledSettingsLength = forciblyEnabledSettings.length;
        let isSingleFormMessage = forciblyEnabledSettingsLength === 1;
        return `${forciblyEnabledSettingsLength} setting${isSingleFormMessage ? ' is' : 's are'} enabled forcibly. 
            Don't forget to disable ${isSingleFormMessage ? 'it' : 'them'}!`;
    }
}
