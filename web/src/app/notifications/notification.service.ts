import { Injectable } from '@angular/core';
import {NotificationBarService, NotificationType} from "angular2-notification-bar";

const NOTIFICATION_DURATION = 6000;

@Injectable()
export class NotificationService {

    constructor(private notificationBarService: NotificationBarService) { }

    showErrorNotificationBar(message: string) {
        this.notificationBarService.create({
            message: message,
            type: NotificationType.Error,
            hideDelay: NOTIFICATION_DURATION,
            hideOnHover: false
        })
    }
}