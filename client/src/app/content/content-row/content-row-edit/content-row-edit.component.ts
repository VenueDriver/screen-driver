import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Content} from "../../content";

@Component({
    selector: 'content-row-edit',
    templateUrl: './content-row-edit.component.html',
    styleUrls: ['./content-row-edit.component.sass']
})
export class ContentRowEditComponent implements OnInit {
    @Input() content: Content;
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();
    editedContent: Content;

    constructor() {
    }

    ngOnInit() {
        this.editedContent = new Content(this.content);
    }

    save() {
        this.submit.emit(this.editedContent);
    }

    dismissChanges() {
        this.cancel.emit();
    }
}
