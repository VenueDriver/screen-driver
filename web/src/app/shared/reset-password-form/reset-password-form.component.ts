import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {PASSWORD_VALIDATION_PATTERN} from "../../core/entities/user";

import * as _ from 'lodash';
import {ResetPassword} from "./reset-password";

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['./reset-password-form.component.sass']
})
export class ResetPasswordFormComponent implements OnInit {

    @Input() identityVerificationFieldLabel: string;
    @Input() requireEmail = false;
    @Input() failMessage: string;
    @Input() submitButton = 'Change';
    @Input() allowCancel = true;
    @Input() isRequestPerforming: boolean = false;

    @Output() save = new EventEmitter<ResetPassword>();
    @Output() cancel = new EventEmitter();

    changePasswordForm: FormGroup;

    constructor() {
    }

    ngOnInit() {
        this.initFormGroup();
    }

    initFormGroup() {
        let newPasswordControl = this.createNewPasswordControl();
        this.changePasswordForm = new FormGroup({
            'identityVerificationCode': new FormControl('', [Validators.required]),
            'newPassword': newPasswordControl,
            'confirmedPassword': new FormControl('', [
                Validators.required,
                this.validateConfirmedPassword(newPasswordControl)
            ])
        });
    }

    private createNewPasswordControl(): FormControl {
        return new FormControl('', [
            Validators.required,
            Validators.pattern(PASSWORD_VALIDATION_PATTERN),
            this.validateLength()
        ]);
    }

    validateConfirmedPassword(newPasswordControl: FormControl) {
        return (control: AbstractControl): { [key: string]: any } => {
            let newPassword = newPasswordControl.value;
            let confirmedPassword = control.value;
            let passwordsEqual = _.isEqual(newPassword, confirmedPassword);
            return passwordsEqual ? null : {'confirmationFailed': {value: control.value}};
        }
    }

    validateLength() {
        return (control: AbstractControl): { [key: string]: any } => {
            let password = control.value;
            return password.length >= 8 ? null : {'smallLength': {value: control.value}};
        }
    }

    formInvalid(): boolean {
        return this.changePasswordForm.status === 'INVALID';
    }

    isRequestSending(): boolean {
      return this.isRequestPerforming
    }

    getValidationMessage(fieldName: string): string {
        let errors = this.changePasswordForm.controls[fieldName].errors;
        if (_.isEmpty(errors)) return '';
        if (errors['required']) return 'Please, fill out this field';
        if (errors['smallLength']) return 'Password is too short (minimum is 8 characters)';
        if (errors['pattern']) return 'Password needs at least one number and one letter';
        if (errors['confirmationFailed']) return 'Password doesn\'t match the confirmation';
        if (errors['notValid']) return 'Invalid password';
    }

    hasError(fieldName: string): boolean {
        let control = this.changePasswordForm.controls[fieldName];
        return !_.isEmpty(control.errors) && (!_.isEmpty(control.value) || control.touched);
    }

    changePassword() {
        if (this.formInvalid()) return;
        this.save.emit(this.extractDataFromForm());
    }

    extractDataFromForm(): ResetPassword {
        let formData = this.changePasswordForm.value;
        return {
            identityVerificationCode: formData.identityVerificationCode,
            password: formData.newPassword
        };
    }

    performCancel() {
        this.cancel.emit();
    }

}
