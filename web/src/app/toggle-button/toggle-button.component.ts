import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'toggle-button',
    templateUrl: './toggle-button.component.html'
})
export class ToggleButtonComponent {
    @Input() enabled: boolean;
    @Input() title: string;
    @Output() changed = new EventEmitter();

    constructor() {
    }

    onClick() {
        this.changed.emit(!this.enabled);
    }
}
