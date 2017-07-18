import {Injectable} from '@angular/core';
import {Setting} from "../entities/setting";
import {Subject, Observable} from "rxjs";
import {SettingsService} from "../settings.service";


@Injectable()
export class SettingStateHolderService {

    private setting: Subject<Setting[]> = new Subject();
    private currentSetting: Subject<Setting> = new Subject();
    private priorityTypes: any[];

    constructor(private settingsService: SettingsService) {
    }

    reloadSetting() {
        this.settingsService.loadSettings()
            .subscribe(response => {
                this.updateSettings(response.json().settings);
                this.priorityTypes = response.json().priorityTypes;
            });
    }

    updateSettings(settings: Setting[]) {
        this.setting.next(settings);
    }

    changeCurrentSetting(setting?: Setting) {
        this.currentSetting.next(setting);
    }

    getAllSettings(): Observable<Setting[]> {
        return this.setting.asObservable();
    }

    getCurrentSetting(): Observable<Setting> {
        return this.currentSetting.asObservable();
    }

    getPriorityTypes(): any[] {
        return this.priorityTypes;
    }
}
