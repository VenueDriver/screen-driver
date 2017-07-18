import {Injectable} from '@angular/core';
import {Setting} from "../entities/setting";
import {Subject, Observable} from "rxjs";
import {SettingsService} from "../settings.service";


@Injectable()
export class SettingStateHolderService {

    private configs: Subject<Setting[]> = new Subject();
    private currentConfig: Subject<Setting> = new Subject();
    private priorityTypes: any[];

    constructor(private configurationsService: SettingsService) {
    }

    reloadConfigs() {
        this.configurationsService.loadConfigs()
            .subscribe(response => {
                this.changeConfigs(response.json().settings);
                this.priorityTypes = response.json().priorityTypes;
            });
    }

    changeConfigs(configs: Setting[]) {
        this.configs.next(configs);
    }

    changeCurrentConfig(config?: Setting) {
        this.currentConfig.next(config);
    }

    getAllConfigs(): Observable<Setting[]> {
        return this.configs.asObservable();
    }

    getCurrentConfig(): Observable<Setting> {
        return this.currentConfig.asObservable();
    }

    getPriorityTypes(): any[] {
        return this.priorityTypes;
    }
}
