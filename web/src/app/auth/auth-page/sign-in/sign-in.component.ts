import {Component} from '@angular/core';
import {NgModel} from "@angular/forms";
import {ErrorMessageExtractor} from "../../../core/error-message-extractor";
import {AuthService} from "../../auth.service";
import {User} from "../../../core/entities/user";

import * as _ from 'lodash';

@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['../auth.component.sass']
})
export class SignInComponent {
    user: User = new User();
    isRequestPerforming: boolean = false;
    failMessage: string;

    constructor(private authService: AuthService) {
    }

    signIn() {
        let userDetails = {email: this.user.email, password: this.user.password};
        this.setRequestPerforming(true);
        this.authService.signIn(userDetails)
            .subscribe(
                () => this.setRequestPerforming(false),
                (error) => {
                    this.setFailMessage(error);
                    this.setRequestPerforming(false)
                })
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

    setFailMessage(error) {
        switch (error) {
            case (''):
                this.failMessage = 'Incorrect username or password.';
                break;
            case ('Missing required parameter USERNAME'):
                this.failMessage = 'Email required';
                break;
            default:
                if (_.isEmpty(error)) {
                    this.failMessage = 'Couldn\'t log you in';
                } else {
                    this.failMessage = ErrorMessageExtractor.extractMessage(error);
                }
        }
    }

    getValidationMessage(model: NgModel) {
        if (model.errors['required'])
            return 'This field is required';
    }

    hasError(model: NgModel): boolean {
        return model.errors && model.touched;
    }

    sendUnauthorizedUserEmail() {
        this.authService.unauthorizedUserEmail.next(this.user.email);
    }
}
