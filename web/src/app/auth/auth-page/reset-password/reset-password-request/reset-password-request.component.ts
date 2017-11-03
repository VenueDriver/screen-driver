import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth.service";

@Component({
    selector: 'reset-password-request',
    templateUrl: './reset-password-request.component.html',
    styleUrls: ['../../auth.component.sass']
})
export class ResetPasswordRequestComponent implements OnInit {

    isRequestPerforming: false;

    @Input() email: string;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.unauthorizedUserEmail.asObservable()
            .subscribe(email => this.email = email)
    }

}
