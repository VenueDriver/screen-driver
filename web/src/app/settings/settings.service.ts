import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Setting} from "./entities/setting";
import {environment} from "../../environments/environment";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {NotificationService} from "../notifications/notification.service";

const SETTINGS_API_URL = `${environment.apiUrl}/api/settings`;

@Injectable()
export class SettingsService {

    private createSettingEvent: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private http: Http,
                private notificationService: NotificationService) {
    }

    loadSettings(): Observable<Response> {
        return this.http.get(SETTINGS_API_URL)
    }

    createSetting(setting: Setting): Observable<Setting> {
        return this.http.post(SETTINGS_API_URL, setting)
            .map(response => response.json());
    }

    updateSetting(setting: Setting, successMessage?: string, errorMessage?: string): Observable<Setting> {
        let subject = new Subject();
        this.http.put(`${SETTINGS_API_URL}/${setting.id}`, setting)
            .map(response => response.json())
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
        return this.http.delete(`${SETTINGS_API_URL}/${id}`)
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