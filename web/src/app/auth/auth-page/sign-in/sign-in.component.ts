import {Component, OnInit} from '@angular/core';
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
export class SignInComponent implements OnInit {
    user: User = new User();
    isRequestPerforming: boolean = false;
    isFirstLoginMode: boolean = false;
    firstLoginPasswords = {password: '', newPassword: ''};
    failMessage: string;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
    }

    changeFirstLoginMode() {
        this.isFirstLoginMode = !this.isFirstLoginMode
    }

    signIn() {
        let userDetails = {email: this.user.email, password: this.user.password};
        if (this.isFirstLoginMode) {
            userDetails['password'] = this.firstLoginPasswords.password;
            userDetails['newPassword'] = this.firstLoginPasswords.newPassword;
        }
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
}
