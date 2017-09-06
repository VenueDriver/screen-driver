import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {User} from "../../auth/user";
import {UsersService} from "../users.service";
import {Subscription} from "rxjs";
import {NgModel} from "@angular/forms";

@Component({
    selector: 'create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.sass']
})
export class CreateUserComponent implements OnInit {
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();
    user: User = new User();
    users: Array<User> = [];

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.users = this.usersService.getUsers();
    }

    validateEmail(emailModel: NgModel) {
        !this.isEmailValid(emailModel) || !this.isEmailUnique(emailModel);
    }

    isEmailValid(emailModel?: NgModel): boolean {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let validationResult = regex.test(this.user.email);
        if (emailModel && !validationResult) {
            emailModel.control.setErrors({notValid: true});
        }
        return validationResult;
    }

    isEmailUnique(emailModel: NgModel) {
        let emails = this.users.map(user => user.email);
        let validationResult = !emails.find(email => email === this.user.email);
        if (!validationResult) {
            emailModel.control.setErrors({notUnique: true});
        }
        return validationResult;
    }

    getValidationMessage(emailModel: NgModel): string {
        if (emailModel.control.hasError('notValid')) return 'Invalid Email';
        if (emailModel.control.hasError('notUnique')) return 'This email is already in use';
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
}
