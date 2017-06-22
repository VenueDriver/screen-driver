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

    dismiss() {
        this.content = new Content();
        this.formClosed.emit();
    }

    save() {
        if (this.content.validate()) {
            this.contentCreated.emit(this.content);
            this.dismiss();
        }
    }

}
