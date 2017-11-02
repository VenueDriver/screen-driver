import {Injectable} from '@angular/core';
import {User} from "../core/entities/user";
import {ErrorMessageExtractor} from "../core/error-message-extractor";
import {environment} from "../../environments/environment";
import {Subject, Observable, BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../shared/notifications/notification.service";

const EDIT_PROFILE_API = `${environment.apiUrl}/api/auth/profile`;

@Injectable()
export class ProfileManagementService {

    constructor(private httpClient: HttpClient,
                private notificationService: NotificationService,) {

    }

    editProfile(user: User): Observable<User> {
        let subject = new Subject<any>();
        this.httpClient.put(`${EDIT_PROFILE_API}`, user)
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

}
