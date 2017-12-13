import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Content} from "../../content";

@Component({
    selector: 'content-info',
    templateUrl: './content-info.component.html',
    styleUrls: ['./content-info.component.sass']
})
export class ContentInfoComponent implements OnInit {
    @Input() content: Content;

    constructor() {
    }

    ngOnInit() {
    }
}
