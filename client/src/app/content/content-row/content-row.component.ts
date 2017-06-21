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
    @Output() contentCreated = new EventEmitter();

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
