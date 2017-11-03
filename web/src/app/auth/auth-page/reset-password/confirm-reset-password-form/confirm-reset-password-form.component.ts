import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {PASSWORD_VALIDATION_PATTERN} from "../../../../core/entities/user";
import {AuthService} from "../../../auth.service";
import {Router} from "@angular/router";

import * as AuthConsts from "../../../auth-consts";
import * as _ from 'lodash';
import {ErrorMessageExtractor} from "../../../../core/error-message-extractor";

@Component({
    selector: 'confirm-reset-password-form',
    templateUrl: './confirm-reset-password-form.component.html',
    styleUrls: ['./confirm-reset-password-form.component.sass']
})
export class ConfirmResetPasswordFormComponent implements OnInit {
    @Input() email: string;
    @Output() success = new EventEmitter();

    isRequestPerforming: boolean = false;
    changePasswordForm: FormGroup;
    failMessage: string;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnInit() {
        this.initFormGroup();
    }

    initFormGroup() {
        let newPasswordControl = this.createNewPasswordControl();
        this.changePasswordForm = new FormGroup({
            'verificationCode': new FormControl('', [Validators.required]),
            'email': new FormControl(this.email, Validators.required),
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
        this.setRequestPerforming(true);
        this.authService.confirmResetPassword(this.extractDataFromForm()).subscribe(
            () => {
                this.setRequestPerforming(false);
                this.success.emit();
                this.redirect()
            },
            (error) => {
                this.setRequestPerforming(false);
                this.failMessage = ErrorMessageExtractor.extractMessage(error);
            }
        )
    }

    extractDataFromForm() {
        let formData = this.changePasswordForm.value;
        return {
            email: formData.email,
            verificationCode: formData.verificationCode,
            password: formData.newPassword
        };
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

    performCancel() {
        this.redirect();
    }

    redirect() {
        this.router.navigateByUrl(AuthConsts.AUTH_URI);
    }
}
