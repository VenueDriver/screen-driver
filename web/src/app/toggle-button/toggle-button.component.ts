import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'toggle-button',
    templateUrl: './toggle-button.component.html'
})
export class ToggleButtonComponent {
    @Input() checked: boolean;
    @Input() title: string;
    @Input() disabled: boolean = false;
    @Output() changed = new EventEmitter();

    constructor() {
    }

    onClick() {
        this.changed.emit(!this.checked);
    }
}
