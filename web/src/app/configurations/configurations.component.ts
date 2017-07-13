import {Component, OnInit} from '@angular/core';
import {Configuration} from "./entities/configuration";
import {ConfigStateHolderService} from "./configuration-state-manager/config-state-holder.service";

@Component({
    selector: 'configurations',
    templateUrl: 'configurations.component.html',
    styleUrls: ['configurations.component.sass']
})
export class ConfigurationsComponent implements OnInit {

    configs: Configuration[];
    currentConfig: Configuration;

    constructor(private configStateHolderService: ConfigStateHolderService) {
    }

    ngOnInit() {
        this.configStateHolderService.reloadConfigs();
        this.configStateHolderService.getAllConfigs().subscribe(configs => this.configs = configs);
        this.configStateHolderService.getCurrentConfig().subscribe(config => this.currentConfig = config);
    }

    configSelected(config: Configuration) {
        this.configStateHolderService.changeCurrentConfig(config);
    }

}
