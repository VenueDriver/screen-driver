import {Component, OnInit} from '@angular/core';
import {User} from "./user";

@Component({
    selector: 'app-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.sass']
})
export class AuthComponent implements OnInit {
    user: User = new User();
    isFirstLoginMode: boolean = false;
    firstLoginPasswords = {password: '', newPassword: ''};

    constructor() {
    }

    ngOnInit() {
    }

    changeFirstLoginMode() {
        this.isFirstLoginMode = !this.isFirstLoginMode
    }

    signIn() {
        if (this.isFirstLoginMode) {
            //TODO send data to server
            return
        }

    }

}
