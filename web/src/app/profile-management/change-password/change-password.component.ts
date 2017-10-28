import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {PASSWORD_VALIDATION_PATTERN, User} from "../../core/entities/user";
import {NgModel, Validators, FormGroup, FormControl, AbstractControl} from "@angular/forms";

import * as _ from 'lodash';
import {UsersService} from "../../users-management/users.service";

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {
    
    @Input() user: User = new User();
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();

    isRequestPerforming: boolean = false;
    confirmedPassword: string = '';

    changePasswordForm: FormGroup;

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.initFormGroup();
    }

    initFormGroup() {
        this.changePasswordForm = new FormGroup({
            'currentPassword': new FormControl(this.user.password, [Validators.required]),
            'newPassword': new FormControl(this.user.newPassword, [
                Validators.required,
                Validators.pattern(PASSWORD_VALIDATION_PATTERN),
                this.validateLength()
            ]),
            'confirmedPassword': new FormControl(this.confirmedPassword, [
                Validators.required,
                this.validateConfirmedPassword()
            ])
        });
    }

    validateConfirmedPassword() {
        return (control: AbstractControl): { [key: string]: any } => {
            let validationResult = !_.isEqual(this.user.newPassword, this.confirmedPassword);
            return validationResult ? null : {'confirmationFailed': {value: control.value}};
        }
    }

    validateLength() {
        return (control: AbstractControl): { [key: string]: any } => {
            return this.user.newPassword.length < 8 ? null : {'smallLength': {value: control.value}};
        }
    }

    formInvalid(): boolean {
        return this.changePasswordForm.status === 'INVALID';
    }

    getValidationMessage(fieldName: string): string {
        let errors = this.changePasswordForm.controls[fieldName].errors;
        if (_.isEmpty(errors)) return '';
        if (errors['notUnique']) return 'This email is already in use';
        if (errors['required']) return 'Please fill out this field';
        if (errors['smallLength']) return 'Password is too short (minimum is 8 characters)';
        if (errors['pattern']) return 'Password needs at least one number and one letter';
        if (errors['confirmationFailed']) return 'Password doesn\'t match the confirmation';
        if (errors['notValid']) return 'Invalid password';
    }

    hasError(fieldName: string): boolean {
        let control =  this.changePasswordForm.controls[fieldName];
        return !_.isEmpty(control.errors) && (!_.isEmpty(control.value) || control.touched);
    }

    changePassword() {
        this.setRequestPerforming(true);
        this.usersService.editProfile(this.user).subscribe(
            () => {
                this.setRequestPerforming(false);
                this.submit.emit();
            },
            () => this.setRequestPerforming(false)
        )
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

    performCancel() {
        this.cancel.emit();
    }

}
