import { Injectable } from '@angular/core';
import {NotificationsService} from "angular2-notifications/dist";

export const NOTIFICATION_DURATION = 6000;

@Injectable()
export class NotificationService {

    constructor(private notificationsService: NotificationsService) { }

    showErrorNotificationBar(notificationMessage: string, title?: string) {
        let notificationTitle = title ? title : 'Unable to perform operation';
        this.notificationsService.error(
            notificationTitle,
            notificationMessage
        )
    }
}