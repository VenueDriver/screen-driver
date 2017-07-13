import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Configuration} from "../entities/configuration";

@Component({
    selector: 'configurations-manager',
    templateUrl: 'configurations-manager.component.html'
})
export class ConfigurationManagerComponent implements OnInit {

    @Input() configs: Configuration[];
    @Output() configSelected: EventEmitter<Configuration> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onConfigSelected(config: Configuration) {
        this.configSelected.emit(config);
    }
}
