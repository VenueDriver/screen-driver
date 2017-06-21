import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Content} from "../content";

@Component({
    selector: 'content-row',
    templateUrl: './content-row.component.html',
    styleUrls: ['./content-row.component.sass']
})
export class ContentRowComponent implements OnInit {
    @Input() content: Content;
    @Input() isAddModeEnabled: boolean = false;
    @Output() formClosed = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        if (this.isAddModeEnabled) {
            this.content = new Content();
        }
    }

    closeForm() {
        this.content = new Content();
        this.isAddModeEnabled = false;
        this.formClosed.emit();
    }
}
