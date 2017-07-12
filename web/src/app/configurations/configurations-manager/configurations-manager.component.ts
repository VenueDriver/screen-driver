import {Component, OnInit, Input} from '@angular/core';
import {Configuration} from "../entities/configuration";

@Component({
    selector: 'configurations-manager',
    templateUrl: 'configurations-manager.component.html'
})
export class ConfigurationManagerComponent implements OnInit {

    @Input() configs: Configuration[];

    constructor() { }

    ngOnInit() { }

}