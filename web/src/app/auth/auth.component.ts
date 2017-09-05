import {Component, OnInit} from '@angular/core';
import {User} from "./user";
import {AuthService} from "./auth.service";

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
                () => this.setRequestPerforming(false))
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

}
