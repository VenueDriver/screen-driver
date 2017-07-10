import { Injectable } from '@angular/core';
import {NotificationsService} from "angular2-notifications";

export const NOTIFICATION_DURATION = 6000;

@Injectable()
export class NotificationService {

    constructor(private notificationsService: NotificationsService) { }

    showErrorNotificationBar(notificationMessage: string, title?: string) {
        let notificationTitle = title ? title : 'An error has occurred';
        this.notificationsService.error(
            notificationTitle,
            notificationMessage
        )
    }
}