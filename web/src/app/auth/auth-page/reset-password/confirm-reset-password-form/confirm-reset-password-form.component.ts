import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";

import * as AuthConsts from "../../../auth-consts";
import {ErrorMessageExtractor} from "../../../../core/error-message-extractor";
import {ResetPasswordService} from "../reset-password.service";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'confirm-reset-password-form',
    templateUrl: './confirm-reset-password-form.component.html',
    styleUrls: ['../../auth.component.sass']
})
export class ConfirmResetPasswordFormComponent {

    @Input() userId: string;
    @Input() verificationCode: string;

    @Output() success = new EventEmitter();

    isRequestPerforming: boolean = false;
    failMessage: string;
    confirmPasswordForm: FormGroup;

    constructor(private resetPasswordService: ResetPasswordService,
                private router: Router) {
    }

    initPasswords(formGroup: FormGroup) {
        this.confirmPasswordForm = formGroup;
    }

    changePassword() {
        this.setRequestPerforming(true);
        this.resetPasswordService.sendResetPasswordConfirmation(this.extractDataFromForm(this.confirmPasswordForm)).subscribe(
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

    extractDataFromForm(formData: FormGroup) {
        return {
            userId: this.userId,
            verificationCode: this.verificationCode,
            password: formData.value.confirmedPassword
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

    isFormValid() {
        return this.confirmPasswordForm.valid;
    }
}
