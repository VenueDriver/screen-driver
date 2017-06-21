import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Content} from "../content";

@Component({
    selector: 'content-create',
    templateUrl: './content-create.component.html',
    styleUrls: ['./content-create.component.sass']
})
export class ContentCreateComponent implements OnInit {
    @Input() content: Content;
    @Output() formClosed = new EventEmitter();
    @Output() contentCreated = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        this.content = new Content();
    }

    closeForm() {
        this.content = new Content();
        this.formClosed.emit();
    }

    save() {
        if (this.isReadyToSave()) {
            this.contentCreated.emit(this.content);
            this.closeForm();
        }
    }

    //TODO implement url validation
    isReadyToSave() {
        return this.content.short_name
            && this.content.short_name.length > 3
            && this.content.url
            && this.content.url.length > 3;
    }
}
