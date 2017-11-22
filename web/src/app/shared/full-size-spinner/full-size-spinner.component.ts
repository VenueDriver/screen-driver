import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'full-size-spinner',
    templateUrl: './full-size-spinner.component.html',
    styleUrls: ['./full-size-spinner.component.sass']
})
export class FullSizeSpinnerComponent implements OnInit {
    @Input() displayed: boolean;

    constructor() {
    }

    ngOnInit() {
    }
}
