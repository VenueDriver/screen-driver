import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import * as _ from 'lodash';

@Component({
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    styleUrls: ['./change-email.component.sass']
})
export class ChangeEmailComponent implements OnInit {
    @Input() email: string;
    @Output() submit =  new EventEmitter();
    @Output() cancel =  new EventEmitter();
    editedEmail: string;

    constructor() {
    }

    ngOnInit() {
        this.editedEmail = _.clone(this.email);
    }

    performCancel() {
        this.cancel.emit();
    }

    performSubmit() {
        this.submit.emit(this.editedEmail)
    }

}
