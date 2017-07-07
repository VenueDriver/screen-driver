import {Component} from '@angular/core';
import {NOTIFICATION_DURATION} from "./notification.service";

@Component({
    selector: 'notification',
    templateUrl: 'notification.component.html',
})
export class NotificationComponent {

    public options = {
        position: ["bottom", "right"],
        timeOut: NOTIFICATION_DURATION,
        maxStack: 3,
        lastOnBottom: true,
        showProgressBar: false,
        pauseOnHover: true,
        clickToClose: false,
        maxLength: 0
    };

}