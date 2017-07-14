import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'toggle-button',
    templateUrl: './toggle-button.component.html'
})
export class ToggleButtonComponent implements OnInit {
    @Input() enabled: boolean;
    @Output() changed = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    onClick() {
        this.changed.emit(!this.enabled);
    }
}
