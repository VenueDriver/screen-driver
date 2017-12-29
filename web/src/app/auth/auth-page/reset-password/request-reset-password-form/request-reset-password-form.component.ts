import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../auth.service";
import {ResetPasswordService} from "../reset-password.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorMessageExtractor} from "../../../../core/error-message-extractor";

import * as _ from 'lodash';

@Component({
    selector: 'request-reset-password-form',
    templateUrl: './request-reset-password-form.component.html',
    styleUrls: ['../../auth.component.sass'],
    providers: [ResetPasswordService]
})
export class RequestResetPasswordFormComponent implements OnInit {

    requestPerformed = false;

    isRequestPerforming = false;
    resetPasswordForm: FormGroup;
    failMessage: string;

    constructor(private authService: AuthService,
                private resetPasswordService: ResetPasswordService) {
    }

    ngOnInit() {
        this.authService.unauthorizedUserEmail.asObservable()
            .subscribe(email => this.initForm(email));
    }

    initForm(email: string) {
        this.resetPasswordForm = new FormGroup({
            'email': new FormControl(email, [
                Validators.required,
                Validators.email
            ])
        });
    }

    getValidationMessage(): string {
        let errors = this.resetPasswordForm.controls.email.errors;
        if (_.isEmpty(errors)) return '';
        if (errors['required']) return 'Please, fill out this field';
        return 'Invalid email';
    }

    submitRequest() {
        this.setRequestPerforming(true);
        this.resetPasswordService.sendResetPasswordRequest(this.resetPasswordForm.value)
            .subscribe(
                () => {
                    this.setRequestPerforming(false);
                    this.requestPerformed = true;
                },
                (error) => {
                    this.setRequestPerforming(false);
                    this.failMessage = ErrorMessageExtractor.extractMessage(error)
                }
            )
    }

    hasError(): boolean {
        let emailControl = this.resetPasswordForm.controls.email;
        return (this.emailNotEmpty() || emailControl.touched) && this.formInvalid();
    }

    emailNotEmpty(): boolean {
        return !_.isEmpty(this.resetPasswordForm.value.email);
    }

    formInvalid(): boolean {
        return this.resetPasswordForm.status === 'INVALID';
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

}
