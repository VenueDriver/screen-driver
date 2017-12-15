import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import * as _ from 'lodash';
import {ResetPassword} from "./reset-password";

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['./reset-password-form.component.sass']
})
export class ResetPasswordFormComponent implements OnInit {

    @Input() identityVerificationFieldLabel: string;
    @Input() identityVerificationCodeRequired = true;
    @Input() requireEmail = false;
    @Input() failMessage: string;
    @Input() submitButton = 'Change';
    @Input() allowCancel = true;
    @Input() isRequestPerforming: boolean = false;

    @Output() save = new EventEmitter<ResetPassword>();
    @Output() cancel = new EventEmitter();

    changePasswordForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.initFormGroup();
    }

    initFormGroup() {
        this.changePasswordForm = this.formBuilder.group({
            'identityVerificationCode': new FormControl('', this.getValidatorsForIdentityVerificationCode()),
            'passwords': this.formBuilder.array([])
        });
    }

    initPasswords(formGroup: FormGroup) {
        let controls = <FormArray>this.changePasswordForm.controls['passwords'];
        controls.push(formGroup);
    }

    private getValidatorsForIdentityVerificationCode(): Array<any> {
        return this.identityVerificationCodeRequired ? [Validators.required] : [];
    }

    formInvalid(): boolean {
        return this.changePasswordForm.status === 'INVALID';
    }

    isRequestSending(): boolean {
        return this.isRequestPerforming
    }

    getValidationMessage(): string {
        let errors = this.changePasswordForm.controls.identityVerificationCode.errors;
        if (_.isEmpty(errors)) return '';
        if (errors['required']) return 'Please, fill out this field';
    }

    hasError(): boolean {
        let control = this.changePasswordForm.controls.identityVerificationCode;
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
            password: formData.passwords[0].confirmedPassword
        };
    }

    performCancel() {
        this.cancel.emit();
    }

}
