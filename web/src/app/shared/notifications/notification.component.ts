import {Component} from '@angular/core';
import {NOTIFICATION_DURATION} from "./notification.service";

@Component({
    selector: 'notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.sass']
})
export class NotificationComponent {

    public options = {
        position: ["bottom", "right"],
        timeOut: NOTIFICATION_DURATION,
        maxStack: 1,
        lastOnBottom: true,
        showProgressBar: false,
        pauseOnHover: true,
        clickToClose: false,
        maxLength: 0
    };

}