import {Directive, HostListener, HostBinding, Input} from '@angular/core';

@Directive({
    selector: '[hideOnScroll]'
})
export class HideOnScrollDirective {

    @Input() offset = 30;

    @HostBinding('style.display')
    display;

    @HostListener('window:scroll')
    onScroll() {
        this.display = window.pageYOffset > this.offset ? 'none' : 'block';
    }

}
