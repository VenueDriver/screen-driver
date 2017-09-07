import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {User} from "../../auth/user";
import {UsersService} from "../users.service";
import {NgModel} from "@angular/forms";

import * as _ from 'lodash';

@Component({
    selector: 'create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.sass']
})
export class CreateUserComponent implements OnInit {
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();
    user: User = new User();
    emails: Array<string> = [];

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.emails = _.map(this.usersService.getUsers(), user => user.email);
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

    isEmailUnique(emailModel: NgModel): boolean {
        let validationResult = !_.find(this.emails, email => email === this.user.email);
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
