import { Component, OnInit } from '@angular/core';
import {ConfigurationsService} from "../configurations.service";
import {Configuration} from "../entities/configuration";

@Component({
    selector: 'configuration-creator',
    templateUrl: 'configuration-creator.component.html'
})
export class ConfigurationCreatorComponent implements OnInit {

    private config = new Configuration();

    constructor(private configsService: ConfigurationsService) { }

    ngOnInit() { }

    performSubmit() {
        this.configsService.createConfiguration(this.config).subscribe(() => {});
    }
}