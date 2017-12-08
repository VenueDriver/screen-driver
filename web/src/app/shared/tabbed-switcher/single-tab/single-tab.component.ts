import {Component, Input} from '@angular/core';

@Component({
    selector: 'single-tab',
    templateUrl: 'single-tab.component.html'
})
export class SingleTabComponent {

    @Input() title: string;
    @Input() disabled = false;

    show = false;

}
