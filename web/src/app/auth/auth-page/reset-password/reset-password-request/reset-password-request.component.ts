import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../auth.service";
import {ResetPasswordService} from "../reset-password.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorMessageExtractor} from "../../../../core/error-message-extractor";

import * as _ from 'lodash';

@Component({
    selector: 'reset-password-request',
    templateUrl: './reset-password-request.component.html',
    styleUrls: ['../../auth.component.sass'],
    providers: [ResetPasswordService]
})
export class ResetPasswordRequestComponent implements OnInit {

    @Output() requested = new EventEmitter();

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
        this.isRequestPerforming = true;
        this.resetPasswordService.sendResetPasswordRequest(this.resetPasswordForm.value)
            .map(() => this.isRequestPerforming = false)
            .subscribe(
                () => this.requested.emit(this.resetPasswordForm.value.email),
                (error) => this.failMessage = ErrorMessageExtractor.extractMessage(error)
            )
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
