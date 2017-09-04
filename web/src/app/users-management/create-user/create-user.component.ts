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
    isShowEmailValidationError: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    validateEmail() {
        this.isShowEmailValidationError = !this.isEmailValid();
    }

    isEmailValid(): boolean {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(this.user.email)
    }

    setUserRole(event: boolean) {
        this.user.isAdmin = event;
    }

    performCancel() {
        this.cancel.emit();
    }

    performSubmit() {
        this.submit.emit(this.user);
    }

    isCreateButtonDisplayed(): boolean {
        return this.isEmailValid()
    }
}
