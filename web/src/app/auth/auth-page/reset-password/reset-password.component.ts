import {Component} from '@angular/core';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent {

    isRequested: boolean = false;
    userEmail: string;

    constructor() {
    }

    handleSendingResetRequest(email: string) {
        this.isRequested = true;
        this.userEmail = email;
    }

}
