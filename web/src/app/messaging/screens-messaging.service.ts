import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../notifications/notification.service";

@Injectable()
export class ScreensMessagingService {
    readonly screensApiPath = `${environment.apiUrl}/api/screens`;

    constructor(private httpClient: HttpClient, private notificationService: NotificationService) {
    }

    refreshScreen(id: string): Observable<any> {
        let data = {screens: [id]};
        return this.httpClient.post(this.screensApiPath + '/refresh', data);
    }

    updateClientApps(content: any) {
        return this.httpClient.post(this.screensApiPath + '/update-applications', content).subscribe(
            () => this.notificationService.showSuccessNotificationBar('Update request has been sent successfully.'),
            (error) => this.notificationService.showErrorNotificationBar('Update request failed. Try again after refresh the page.'))
    };
}
