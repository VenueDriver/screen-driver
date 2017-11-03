import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../auth.service";
import {ResetPasswordRequestService} from "./reset-password-request.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorMessageExtractor} from "../../../../core/error-message-extractor";

import * as _ from 'lodash';

@Component({
    selector: 'reset-password-request',
    templateUrl: './reset-password-request.component.html',
    styleUrls: ['../../auth.component.sass'],
    providers: [ResetPasswordRequestService]
})
export class ResetPasswordRequestComponent implements OnInit {

    isRequestPerforming = false;
    resetPasswordForm: FormGroup;
    failMessage: string;

    constructor(private authService: AuthService,
                private resetPasswordService: ResetPasswordRequestService) {
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
        this.isRequestPerforming = true;
        this.resetPasswordService.sendResetPasswordRequest(this.resetPasswordForm.value)
            .map(() => this.isRequestPerforming = false)
            .subscribe(
                this.handleSuccessResponse,
                (error) => this.failMessage = ErrorMessageExtractor.extractMessage(error)
            )
    }

    handleSuccessResponse(response) {
        console.log(response)
    }

    hasError(): boolean {
        return (this.emailNotEmpty() || this.resetPasswordForm.controls.email.touched) && this.formInvalid();
    }

    emailNotEmpty(): boolean {
        return !_.isEmpty(this.resetPasswordForm.value.email);
    }

    formInvalid(): boolean {
        return this.resetPasswordForm.status === 'INVALID';
    }

}
