import {Injectable} from '@angular/core';
import {NotificationService} from "../shared/notifications/notification.service";
import {User} from "../core/entities/user";
import {Subject, Observable, BehaviorSubject} from "rxjs";

import * as _ from 'lodash';
import {ErrorMessageExtractor} from "../core/error-message-extractor";
import {ApiService} from "../shared/services/api.service";
import {RequestConfig} from "../shared/services/configs/request-config";
import {SpinnerName} from "../shared/spinner/uniq-entity-spinner/spinner-name";

const USERS_API = `/api/auth/users`;

@Injectable()
export class UsersService {
    private users: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);
    createUserEvent: Subject<User> = new Subject();

    constructor(private httpClient: ApiService,
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

    changeUserStatus(user: User): Observable<any> {
        let subject = new Subject<any>();
        let requestSettings: RequestConfig = {spinner: {name: SpinnerName.getName(user, "users")}};

        this.httpClient.patch(`${USERS_API}/${user.id}/enabled`, user, requestSettings)
            .subscribe(
                response => {
                    subject.next(response);
                    this.notificationService.showSuccessNotificationBar('User status changed successfully');
                },
                error => {
                    let errorMessage = ErrorMessageExtractor.extractMessage(error);
                    this.notificationService.showErrorNotificationBar(errorMessage, 'Unable to change user user status');
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
