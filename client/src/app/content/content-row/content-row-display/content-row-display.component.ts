import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Content} from "../../content";

@Component({
    selector: 'content-row-display',
    templateUrl: './content-row-display.component.html',
    styleUrls: ['./content-row-display.component.sass']
})
export class ContentRowDisplayComponent implements OnInit {
    @Input() content: Content;

    constructor() {
    }

    ngOnInit() {
    }
}
