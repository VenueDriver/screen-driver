import {Injectable} from '@angular/core';
import {Configuration} from "../../configurations/entities/configuration";
import {Subject, Observable} from "rxjs";
import {ConfigurationsService} from "../configurations.service";


@Injectable()
export class ConfigStateHolderService {

    private configs: Subject<Configuration[]> = new Subject();
    private currentConfig: Subject<Configuration> = new Subject();

    constructor(private configurationsService: ConfigurationsService) {
    }

    reloadConfigs() {
        this.configurationsService.loadConfigs()
            .subscribe(response => this.changeConfigs(response.json()));
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
}
