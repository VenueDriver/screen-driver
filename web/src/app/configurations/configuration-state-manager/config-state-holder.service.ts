import {Injectable} from '@angular/core';
import {Configuration} from "../../configurations/entities/configuration";
import {Subject, Observable} from "rxjs";
import {ConfigurationsService} from "../configurations.service";


@Injectable()
export class ConfigStateHolderService {

    private configs: Subject<Configuration[]> = new Subject();
    private currentConfig: Subject<Configuration> = new Subject();
    private priorityTypes: any[];

    constructor(private configurationsService: ConfigurationsService) {
    }

    reloadConfigs() {
        this.configurationsService.loadConfigs()
            .subscribe(response => {
                this.changeConfigs(response.json().settings);
                this.priorityTypes = response.json().priorityTypes;
            });
    }

    changeConfigs(configs: Configuration[]) {
        this.configs.next(configs);
    }

    changeCurrentConfig(config: Configuration) {
        this.currentConfig.next(config);
    }

    getAllConfigs(): Observable<Configuration[]> {
        return this.configs.asObservable();
    }

    getCurrentConfig(): Observable<Configuration> {
        return this.currentConfig.asObservable();
    }

    getPriorityTypes(): any[] {
        return this.priorityTypes;
    }
}
