import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {User} from "../../core/entities/user";
import {UsersService} from "../users.service";
import {NgModel, Validators, FormGroup, FormControl, AbstractControl} from "@angular/forms";

import * as _ from 'lodash';

const EMAIL_VALIDATION_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    userForm: FormGroup;

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.usersService.getUsers().subscribe(users => this.setEmails(users));
        this.userForm = new FormGroup({
            'email': new FormControl(this.user.email, [
                Validators.required,
                Validators.pattern(EMAIL_VALIDATION_PATTERN),
                this.validateEmailUniqueness()
            ]),
            'isAdmin': new FormControl(this.user.isAdmin)
        });
    }

    private setEmails(users: User[]) {
        this.emails = _.map(users, user => user.email);
    }

    isEmailValid(emailModel?: NgModel): boolean {
        let validationResult = User.isEmailValid(this.user.email);
        if (emailModel && !validationResult) {
            emailModel.control.setErrors({notValid: true});
        }
        return validationResult;
    }

    validateEmailUniqueness() {
        return (control: AbstractControl): { [key: string]: any } => {
            let email = control.value;
            let validationResult = _.find(this.emails, e => e === email);
            return _.isEmpty(validationResult) ? null : {'notUnique': {value: control.value}};
        }
    }

    getErrorMessage(): string {
        let errors = this.userForm.controls.email.errors;
        if (errors['notUnique']) return 'This email is already in use';
        if (this.emailNotEmpty()) return 'Invalid Email';
    }

    performCancel() {
        this.cancel.emit();
    }

    performSubmit() {
        if (!this.formInvalid()) {
            this.submit.emit(this.userForm.value);
        }
    }

    formInvalid(): boolean {
        return this.userForm.status === 'INVALID';
    }

    emailNotEmpty(): boolean {
        return !_.isEmpty(this.userForm.value.email);
    }
}
