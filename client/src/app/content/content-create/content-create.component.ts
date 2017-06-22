import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Content} from "../content";

@Component({
    selector: 'content-create',
    templateUrl: './content-create.component.html',
    styleUrls: ['./content-create.component.sass']
})
export class ContentCreateComponent implements OnInit {
    content: Content = new Content();
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    dismiss() {
        this.content = new Content();
        this.cancel.emit();
    }

    save() {
        if (this.content.validate()) {
            this.submit.emit(this.content);
            this.dismiss();
        }
    }

}
