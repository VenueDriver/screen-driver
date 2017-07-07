import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[autofocus]'
})
export class AutofocusDirective {
    @Input() set autofocus(condition: boolean) {
        this._autofocus = condition;
    }

    private _autofocus = true;

    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        if (this._autofocus || typeof this._autofocus === "undefined")
            this.el.nativeElement.focus()
    }
}
