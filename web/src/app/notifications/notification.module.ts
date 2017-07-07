import {NgModule} from "@angular/core";
import {NotificationComponent} from "./notification.component";
import {SimpleNotificationsModule, NotificationsService} from "angular2-notifications";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    imports: [
        BrowserAnimationsModule,
        SimpleNotificationsModule.forRoot()
    ],
    exports: [
        NotificationComponent
    ],
    declarations: [
        NotificationComponent
    ],
    providers: [
        NotificationsService
    ]
})
export class NotificationModule {

}