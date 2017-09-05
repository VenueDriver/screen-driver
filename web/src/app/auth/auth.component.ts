import {Component, OnInit} from '@angular/core';
import {User} from "./user";
import {AuthService} from "./auth.service";
import {NgModel} from "@angular/forms";

@Component({
    selector: 'app-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.sass']
})
export class AuthComponent implements OnInit {
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
            case ('Missing required parameter USERNAME'):
                this.failMessage = 'Missed email field';
                break;
            default:
                this.failMessage = error;
        }
    }

    getValidationMessage(model: NgModel) {
        if (model.errors['required'])
            return 'This field is required';
    }

}
