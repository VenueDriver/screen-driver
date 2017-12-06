import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {NotificationService} from "../../notifications/notification.service";
import {ApiService} from "../api.service";

@Injectable()
export class ScreensMessagingService {

    readonly refreshScreensApiUrl = '/api/screens/refresh';
    readonly updateApplicationsApiPath = '/api/screens/update-applications';

    constructor(private apiService: ApiService, private notificationService: NotificationService) {
    }

    refreshScreen(id: string): Observable<any> {
        let data = {screens: [id]};
        return this.apiService.post(this.refreshScreensApiUrl, data);
    }

    updateClientApps(content: any) {
        return this.apiService.post(this.updateApplicationsApiPath, content).subscribe(
            () => this.notificationService.showSuccessNotificationBar('Update request has been sent successfully.'),
            (error) => this.notificationService.showErrorNotificationBar('Update request failed. Try again after refresh the page.'))
    };
}
