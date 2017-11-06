import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";

import * as AuthConsts from "../../../auth-consts";
import {ErrorMessageExtractor} from "../../../../core/error-message-extractor";
import {ResetPasswordService} from "../reset-password.service";
import {ResetPassword} from "../../../../shared/reset-password-form/reset-password";

@Component({
    selector: 'confirm-reset-password-form',
    templateUrl: './confirm-reset-password-form.component.html',
    styleUrls: ['../../auth.component.sass']
})
export class ConfirmResetPasswordFormComponent {
    @Input() email: string;
    @Output() success = new EventEmitter();

    isRequestPerforming: boolean = false;
    failMessage: string;

    constructor(private resetPasswordService: ResetPasswordService,
                private router: Router) {
    }


    changePassword(formData: ResetPassword) {
        this.setRequestPerforming(true);
        this.resetPasswordService.sendResetPasswordConfirmation(this.extractDataFromForm(formData)).subscribe(
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

    extractDataFromForm(formData: ResetPassword) {
        return {
            email: this.email,
            verificationCode: formData.identityVerificationCode,
            password: formData.password
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
