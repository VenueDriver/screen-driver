import { Component, OnInit } from '@angular/core';
import {Configuration} from "./entities/configuration";
import {ConfigurationsService} from "./configurations.service";

@Component({
    selector: 'configurations',
    templateUrl: 'configurations.component.html'
})
export class ConfigurationsComponent implements OnInit {

    configs: Configuration[];

    constructor(private configurationsService: ConfigurationsService) { }

    ngOnInit() {
        this.loadConfigs();
    }

    loadConfigs() {
        this.configurationsService.loadConfigs()
            .subscribe(response => this.configs = response.json());
    }

    handleConfigCreation() {
        this.loadConfigs();
    }
}