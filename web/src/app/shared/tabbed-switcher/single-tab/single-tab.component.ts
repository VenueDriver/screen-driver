import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'single-tab',
    templateUrl: 'single-tab.component.html'
})
export class SingleTabComponent {

    @Input() title: string;
    @Input() set disabled(disabled: boolean) {
        this._disabled = disabled;
        if (this.disabled) this.active = false;
        this.changed.next();
    }

    changed = new Subject();
    active = false;

    private _disabled = false;

    get disabled() {
        return this._disabled;
    }
}
