import {Injectable} from '@angular/core';
import {NotificationService} from "../notifications/notification.service";
import {User} from "../common/entities/user";
import {environment} from "../../environments/environment";
import {Subject, Observable, BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";

import * as _ from 'lodash';
import {ErrorMessageExtractor} from "../common/error-message-extractor";

const USERS_API = `${environment.apiUrl}/api/auth/users`;
const EDIT_PROFILE_API = `${environment.apiUrl}/api/auth/edit-profile`;

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
                    let errorMessage = ErrorMessageExtractor.extractMessage(error);
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
                (response: User) => {
                    subject.next(response);
                    this.applyChangesInUserList(response);
                    this.notificationService.showSuccessNotificationBar('User was updated successfully');
                },
                error => {
                    let errorMessage = ErrorMessageExtractor.extractMessage(error);
                    this.notificationService.showErrorNotificationBar('Unable to change user role: ' + errorMessage);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    editProfile(user: User): Observable<User> {
        let subject = new Subject<any>();
        this.httpClient.post(`${EDIT_PROFILE_API}`, user)
            .subscribe(
                response => {
                    subject.next(response);
                    this.notificationService.showSuccessNotificationBar('Profile was edited successfully');
                },
                error => {
                    let errorMessage = ErrorMessageExtractor.extractMessage(error);
                    this.notificationService.showErrorNotificationBar(errorMessage, 'Unable to edit user profile');
                    subject.error(errorMessage);
                }
            );
        return subject;
    }


    applyChangesInUserList(updatedUser: User) {
        let users = this.users.getValue();
        users = _.reject(users, user => user.id === updatedUser.id);
        users.push(updatedUser);
        this.users.next(users);
    }

    getUsers(): Observable<Array<User>> {
        if (_.isEmpty(this.users.getValue())) {
            this.loadUsers();
        }
        return this.users;
    }
}
