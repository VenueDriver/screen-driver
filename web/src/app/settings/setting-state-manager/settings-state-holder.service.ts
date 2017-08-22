import {Injectable} from '@angular/core';
import {Setting} from "../entities/setting";
import {Subject, Observable} from "rxjs";
import {SettingsService} from "../settings.service";

import * as _ from 'lodash';

@Injectable()
export class SettingStateHolderService {

    private setting: Subject<Setting[]> = new Subject();
    private currentSetting: Subject<Setting> = new Subject();
    private priorityTypes: Array<any>;

    constructor(private settingsService: SettingsService) {
    }

    reloadSettings(currentSettingId?: string) {
        this.settingsService.loadSettings()
            .subscribe(response => {
                let settings = response.json().settings;
                this.updateSettings(settings);
                this.priorityTypes = response.json().priorityTypes;
                this.updateCurrentSettingIfSelected(settings, currentSettingId);
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

    getPriorityTypes(): any[] {
        return this.priorityTypes;
    }
}
