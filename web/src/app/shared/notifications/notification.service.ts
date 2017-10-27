import { Injectable } from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {Notification} from "angular2-notifications/dist";

export const NOTIFICATION_DURATION = 6000;

@Injectable()
export class NotificationService {

    constructor(private notificationsService: NotificationsService) { }

    showErrorNotificationBar(notificationMessage: string, title?: string) {
        let notificationTitle = title ? title : 'An error has occurred';
        this.notificationsService.error(
            notificationTitle,
            notificationMessage
        );
    }

    showSuccessNotificationBar(notificationMessage: string, title?: string) {
        let notificationTitle = title ? title : 'Success';
        this.notificationsService.success(
            notificationTitle,
            notificationMessage
        )
    }

    showWarningNotificationBar(notificationMessage: string, overrideOptions?): Notification {
        return this.notificationsService.warn(
            'Warning',
            notificationMessage,
            overrideOptions
        )
    }

    showNonVanishingWarning(notificationMessage: string): Notification {
        let overrideOptions = {timeOut: 0, animate: null};
        return this.showWarningNotificationBar(notificationMessage, overrideOptions);
    }

    hide(id?: string) {
        this.notificationsService.remove(id);
    }
}