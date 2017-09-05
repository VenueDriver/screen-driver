import { Injectable } from '@angular/core';
import {Response} from "@angular/http";
import {Setting} from "./entities/setting";
import {environment} from "../../environments/environment";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {NotificationService} from "../notifications/notification.service";
import {HttpClient} from "@angular/common/http";

const SETTINGS_API_URL = `${environment.apiUrl}/api/settings`;

@Injectable()
export class SettingsService {

    private createSettingEvent: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private httpClient: HttpClient,
                private notificationService: NotificationService) {
    }

    loadSettings(): Observable<any> {
        return this.httpClient.get(SETTINGS_API_URL)
    }

    createSetting(setting: Setting): Observable<Setting> {
        return this.httpClient.post(SETTINGS_API_URL, setting)
    }

    updateSetting(setting: Setting, successMessage?: string, errorMessage?: string): Observable<Setting> {
        let subject = new Subject();
        this.httpClient.put(`${SETTINGS_API_URL}/${setting.id}`, setting)
            .subscribe(response => {
                let message = successMessage ? successMessage : 'Setting was updated successfully';
                this.notificationService.showSuccessNotificationBar(message);
                subject.next(response)
            }, error => {
                let message = this.getUpdateErrorMessage(error, errorMessage);
                this.notificationService.showErrorNotificationBar(message);
                subject.error(error)
            });
        return subject;
    }

    getUpdateErrorMessage(error, errorMessage: string) {
        if (error.status === 409) {
            return 'Conflict between settings has been detected. Setting is disabled now';
        }
        return errorMessage ? errorMessage : 'Unable to update setting';
    }

    removeSetting(id: string): Observable<Response> {
        return this.httpClient.delete(`${SETTINGS_API_URL}/${id}`)
    }

    getCreateSettingEventSubscription(): Observable<any> {
        return this.createSettingEvent;
    }

    getCreateSettingLastValue(): any {
        return this.createSettingEvent.getValue();
    }

    emitCreateSettingEvent(isEnabled: boolean, priorityType?: Object) {
        this.createSettingEvent.next({isEnabled: isEnabled, priorityType: priorityType});
    }
}