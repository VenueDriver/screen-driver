import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {User} from "../../auth/user";

@Component({
    selector: 'create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.sass']
})
export class CreateUserComponent implements OnInit {
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();
    user: User = new User();

    constructor() {
    }

    ngOnInit() {
    }

    performCancel() {
        this.cancel.emit();
    }

    performSubmit() {
        this.submit.emit(this.user);
    }
}
