import {Injectable} from '@angular/core';
import {NotificationService} from "../notifications/notification.service";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";

const AUTH_API = `${environment.apiUrl}/api/auth`;

@Injectable()
export class AuthService {

    constructor(private http: Http,
                private notificationService: NotificationService,) {
    }

    signIn(userDetails) {
        let subject = new Subject();
        this.http.post(AUTH_API, userDetails)
            .map(response => response.json())
            .subscribe(
                response => {
                    localStorage.setItem('id_token', response.idToken.jwtToken);
                    subject.next(response);
                },
                error => {
                    let errorMessage = this.getErrorMessage(error);
                    this.notificationService.showErrorNotificationBar(errorMessage, 'Cannot login user');
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    private getErrorMessage(error): string {
        return error.json().error ? error.json().error : error.json().message.message;
    }

}
