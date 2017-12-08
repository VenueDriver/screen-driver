import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PASSWORD_VALIDATION_PATTERN} from "../../core/entities/user";

import * as _ from 'lodash';


@Component({
    selector: 'confirm-password-fields',
    templateUrl: './confirm-password-fields.component.html',
    styleUrls: ['./confirm-password-fields.component.sass']
})
export class ConfirmPasswordFieldsComponent implements OnInit {
   confirmPasswordFields: FormGroup;

   @Output() formGroup = new EventEmitter();


    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.initFormGroup();
        this.formGroup.emit(this.confirmPasswordFields);
    }

    initFormGroup() {
        let newPasswordControl = this.createNewPasswordControl();
        this.confirmPasswordFields = this.formBuilder.group({
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

    validateLength() {
        return (control: AbstractControl): { [key: string]: any } => {
            let password = control.value;
            return password.length >= 8 ? null : {'smallLength': {value: control.value}};
        }
    }

    validateConfirmedPassword(newPasswordControl: FormControl) {
        return (control: AbstractControl): { [key: string]: any } => {
            let newPassword = newPasswordControl.value;
            let confirmedPassword = control.value;
            let passwordsEqual = _.isEqual(newPassword, confirmedPassword);
            return passwordsEqual ? null : {'confirmationFailed': {value: control.value}};
        }
    }

    hasError(fieldName: string): boolean {
        let control = this.confirmPasswordFields.controls[fieldName];
        return !_.isEmpty(control.errors) && (!_.isEmpty(control.value) || control.touched);
    }

    getValidationMessage(fieldName: string): string {
        let errors = this.confirmPasswordFields.controls[fieldName].errors;
        if (_.isEmpty(errors)) return '';
        if (errors['required']) return 'Please, fill out this field';
        if (errors['smallLength']) return 'Password is too short (minimum is 8 characters)';
        if (errors['pattern']) return 'Password needs at least one number and one letter';
        if (errors['confirmationFailed']) return 'Password doesn\'t match the confirmation';
        if (errors['notValid']) return 'Invalid password';
    }

}
