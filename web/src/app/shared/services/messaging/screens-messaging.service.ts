import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {NotificationService} from "../../notifications/notification.service";
import {ApiService} from "../api.service";

@Injectable()
export class ScreensMessagingService {
    readonly screensApiPath = '/api/screens';

    constructor(private apiService: ApiService, private notificationService: NotificationService) {
    }

    refreshScreen(id: string): Observable<any> {
        let data = {screens: [id]};
        return this.apiService.post(`${this.screensApiPath}/refresh`, data);
    }

    updateClientApps(content: any) {
        return this.apiService.post(`${this.screensApiPath}/update-applications`, content).subscribe(
            () => this.notificationService.showSuccessNotificationBar('Update request has been sent successfully.'),
            (error) => this.notificationService.showErrorNotificationBar('Update request failed. Try again after refresh the page.'))
    };
}
