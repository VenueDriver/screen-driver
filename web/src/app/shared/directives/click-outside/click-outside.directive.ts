import {Directive, ElementRef, EventEmitter, Output, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {

    @Output()
    public clickOutside = new EventEmitter();

    @Input()
    public detectClickOutside = true;

    @HostListener('document:click', ['$event'])
    public onClick(event: any) {
        if (this.detectClickOutside) {
            const clickedInside = this.elementRef.nativeElement.contains(event.target);
            if (!clickedInside) {
                this.clickOutside.emit(event);
            }
        }
    }

    constructor(private elementRef : ElementRef) {
    }
}