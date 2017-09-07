import {Injectable} from '@angular/core';
import {NotificationService} from "../notifications/notification.service";
import {User} from "../auth/user";
import {environment} from "../../environments/environment";
import {Subject, Observable, BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";

const USERS_API = `${environment.apiUrl}/api/users`;

@Injectable()
export class UsersService {
    private users: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);
    createUserEvent: Subject<User> = new Subject();

    constructor(private httpClient: HttpClient,
                private notificationService: NotificationService,) {
    }

    loadUsers(): Observable<Array<User>> {
        let subject = new Subject<Array<User>>();
        this.httpClient.get(USERS_API).subscribe((users: Array<User>) => {
            subject.next(users);
            this.users.next(users)
        });
        return subject;
    }

    create(user: User): Observable<User> {
        let subject = new Subject<User>();
        this.httpClient.post(USERS_API, user)
            .subscribe(
                (response: User) => {
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
        this.httpClient.put(`${USERS_API}/${user.id}`, user)
            .subscribe(
                response => {
                    subject.next(response as User);
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
        return error.error ? error.error.message.message : error.message;
    }

    getUsers(): Array<User> {
        return this.users.getValue();
    }
}
