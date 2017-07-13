import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Configuration} from "../entities/configuration";
import {ConfigStateHolderService} from "../configuration-state-manager/config-state-holder.service";

@Component({
    selector: 'configurations-manager',
    templateUrl: 'configurations-manager.component.html',
    styleUrls: ['configurations-manager.component.sass']
})
export class ConfigurationManagerComponent implements OnInit {

    @Input() configs: Configuration[];
    @Output() configSelected: EventEmitter<Configuration> = new EventEmitter();

    activeConfig: Configuration;
    creationMode = false;

    constructor(private configStateHolderService: ConfigStateHolderService) { }

    ngOnInit() {
        if (this.configs) {
            this.activeConfig = this.configs[0];
        }
    }

    onConfigSelected(config: Configuration) {
        this.configSelected.emit(config);
        this.activeConfig = config;
    }

    isActive(config: Configuration): boolean {
        return this.activeConfig && this.activeConfig.id === config.id;
    }

    handleConfigCreation() {
        this.configStateHolderService.reloadConfigs();
    }

    enableCreationMode() {
        this.creationMode = true;
    }

    disableCreationMode() {
        this.creationMode = false;
    }
}
