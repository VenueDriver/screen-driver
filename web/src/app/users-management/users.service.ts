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

    create(user: User): Observable<User> {
        let subject = new Subject<User>();
        this.http.post(USERS_API, user)
            .map(response => response.json())
            .subscribe(
                response => {
                    subject.next(response);
                    this.createUserEvent.next(response);
                    this.notificationService.showSuccessNotificationBar('User was created successfully');
                },
                error => {
                    let errorMessage = this.getErrorMessage(error);
                    this.notificationService.showErrorNotificationBar('Unable to perform the create user operation: ' + errorMessage);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    update(user: User): Observable<User> {
        let subject = new Subject<User>();
        this.http.put(`${USERS_API}/${user.id}`, user)
            .map(response => response.json())
            .subscribe(
                response => {
                    subject.next(response);
                    this.notificationService.showSuccessNotificationBar('User was updated successfully');
                },
                error => {
                    let errorMessage = this.getErrorMessage(error);
                    this.notificationService.showErrorNotificationBar('Unable to change user role: ' + errorMessage);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    private getErrorMessage(error): string {
        return error.json().error ? error.json().error : error.json().message;
    }
}
