import {Component, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleButtonComponent),
    multi: true
};

@Component({
    selector: 'toggle-button',
    templateUrl: './toggle-button.component.html',
    styleUrls: ['./toggle-button.component.sass'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ToggleButtonComponent implements ControlValueAccessor {

    @Input() checked: boolean;
    @Input() title: string;
    @Input() disabled: boolean = false;

    @Output() changed = new EventEmitter();

    onTouchedCallback: () => void;
    onChangeCallback: (_: any) => void;

    constructor() {
    }

    get value(): any {
        return this.checked;
    };

    set value(v: any) {
        if (v !== this.checked) {
            this.checked = v;
            this.onChangeCallback(v);
        }
    }

    onClick() {
        this.changed.emit(!this.checked);
        this.onChangeCallback(!this.checked);
    }

    writeValue(value: any) {
        if (value !== this.changed) {
            this.checked = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

}
