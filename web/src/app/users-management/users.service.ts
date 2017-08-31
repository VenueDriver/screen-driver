import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {NotificationService} from "../notifications/notification.service";
import {User} from "../auth/user";
import {environment} from "../../environments/environment";
import {Subject, Observable, BehaviorSubject} from "rxjs";

const USERS_API = `${environment.apiUrl}/api/users`;

@Injectable()
export class UsersService {
    createUserEvent: Subject<User> = new Subject();

    constructor(private http: Http,
                private notificationService: NotificationService,) {
    }

    loadUsers(): Observable<Response> {
        return this.http.get(USERS_API)
    }

    create(user: User) {
        let subject = new Subject();
        this.http.post(USERS_API, user)
            .map(response => response.json())
            .subscribe(
                response => {
                    subject.next(response);
                    this.createUserEvent.next(response);
                },
                error => {
                    let errorMessage = error.json().message;
                    this.notificationService.showErrorNotificationBar('Unable to perform the create user operation: ' + errorMessage);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    //TODO Implement it
    update(user: User) {

    }
}
