import {Component} from '@angular/core';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent {
    isRequested: boolean = false;
    requestedEmail: string;

    constructor() {
    }

}
