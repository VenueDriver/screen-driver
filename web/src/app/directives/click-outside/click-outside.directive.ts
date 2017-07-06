import {Directive, ElementRef, EventEmitter, Output, HostListener} from '@angular/core';

@Directive({
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {

    @Output()
    public clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event'])
    public onClick(event: any) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }

    constructor(private elementRef : ElementRef) {
    }
}