import {Injectable} from '@angular/core';
import {User} from "../core/entities/user";
import {ErrorMessageExtractor} from "../core/error-message-extractor";
import {environment} from "../../environments/environment";
import {Subject, Observable} from "rxjs";
import {NotificationService} from "../shared/notifications/notification.service";
import {PasswordSet} from "./model/password.model";
import {LocalStorageService} from "../auth/local-storage.service";
import {ApiService} from "../shared/services/api.service";

const EDIT_PROFILE_API = `${environment.apiUrl}/api/auth/profile`;
const CHANGE_PASSWORD_API = `${environment.apiUrl}/api/auth/profile/change_password`;

@Injectable()
export class ProfileManagementService {

    constructor(private apiService: ApiService,
                private notificationService: NotificationService,) {

    }

    editProfile(user: User): Observable<User> {
        let subject = new Subject<any>();
        this.apiService.put(EDIT_PROFILE_API, user)
            .subscribe(
                response => {
                    subject.next(response);
                    this.notificationService.showSuccessNotificationBar('Profile has been updated successfully');
                },
                (error) => this.handleErrorResponse(subject, error, 'Unable to update profile')
            );
        return subject;
    }

    changePassword(passwords: any): Observable<any> {
        let passwordSet: PasswordSet = {password: passwords.currentPassword, newPassword: passwords.newPassword};
        passwordSet.accessToken = LocalStorageService.getAccessToken();
        let subject = new Subject<any>();
        this.apiService.post(CHANGE_PASSWORD_API, passwordSet)
            .subscribe(
                () => {
                    subject.next();
                    this.notificationService.showSuccessNotificationBar('Password has been changed successfully');
                },
                (error) => this.handleErrorResponse(subject, error, 'Unable to change password')
            );
        return subject;
    }

    private handleErrorResponse(subject: Subject<any>, error: any, message: string) {
        let errorMessage = ErrorMessageExtractor.extractMessage(error);
        this.notificationService.showContinuousErrorNotification(errorMessage, message);
        subject.error(errorMessage);
    }

}
