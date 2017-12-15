import {Component, OnInit} from '@angular/core';
import {NgModel} from "@angular/forms";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {ErrorMessageExtractor} from "../../../core/error-message-extractor";
import {AuthService} from "../../auth.service";
import {ResetPassword} from "../../../shared/reset-password-form/reset-password";

@Component({
    selector: 'first-sign-in',
    templateUrl: './first-sign-in.component.html',
    styleUrls: ['../auth.component.sass']
})
export class FirstSignInComponent implements OnInit {

    temporaryPassword: string;
    isRequestPerforming: boolean = false;
    failMessage: string;

    constructor(private activatedRoute: ActivatedRoute,
                private authService: AuthService) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.temporaryPassword = params['token'];
        });
    }

    performSubmit(formData: ResetPassword) {
        this.setRequestPerforming(true);
        this.authService.signIn(this.extractDataFromForm(formData)).subscribe(
            () => {
                this.setRequestPerforming(false);
            },
            (error) => {
                this.setRequestPerforming(false);
                this.failMessage = ErrorMessageExtractor.extractMessage(error);
            }
        )
    }

    extractDataFromForm(formData: ResetPassword) {
        return {
            email: formData.identityVerificationCode,
            password: this.temporaryPassword,
            newPassword: formData.password
        };
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

}
