import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth.service";
import {ResetPasswordRequestService} from "./reset-password-request.service";

@Component({
    selector: 'reset-password-request',
    templateUrl: './reset-password-request.component.html',
    styleUrls: ['../../auth.component.sass'],
    providers: [ResetPasswordRequestService]
})
export class ResetPasswordRequestComponent implements OnInit {

    isRequestPerforming = false;

    @Input() email: string;

    constructor(private authService: AuthService,
                private resetPasswordService: ResetPasswordRequestService) {
    }

    ngOnInit() {
        this.authService.unauthorizedUserEmail.asObservable()
            .subscribe(email => this.email = email)
    }

    submitRequest() {
        this.isRequestPerforming = true;
        this.resetPasswordService.sendResetPasswordRequest(this.email)
            .map(() => this.isRequestPerforming = false)
            .subscribe(this.handleSuccessResponse, this.handleErrorResponse)
    }

    handleSuccessResponse(response) {
        console.log(response)
    }

    handleErrorResponse(error) {
        console.log(error)
    }

}
