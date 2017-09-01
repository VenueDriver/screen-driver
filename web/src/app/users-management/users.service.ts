import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {NotificationService} from "../notifications/notification.service";
import {User} from "../auth/user";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";

const USERS_API = `${environment.apiUrl}/api/users`;

@Injectable()
export class UsersService {

    constructor(private http: Http,
                private notificationService: NotificationService,) {
    }

    create(user: User) {
        let subject = new Subject();
        this.http.post(USERS_API, user)
            .map(response => response.json())
            .subscribe(
                response => {
                    subject.next(response)
                },
                error => {
                    let errorMessage = error.json().message;
                    this.notificationService.showErrorNotificationBar('Unable to perform the create user operation: ' + errorMessage);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

}
