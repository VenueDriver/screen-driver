import { Injectable } from '@angular/core';
import {Setting} from "./entities/setting";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {NotificationService} from "../shared/notifications/notification.service";
import {ApiService} from "../shared/services/api.service";

const SETTINGS_API_URL = '/api/settings';

@Injectable()
export class SettingsService {

    private createSettingEvent: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private apiService: ApiService,
                private notificationService: NotificationService) {
    }

    loadSettings(): Observable<any> {
        return this.apiService.get(SETTINGS_API_URL)
    }

    createSetting(setting: Setting): Observable<Setting> {
        return this.apiService.post(SETTINGS_API_URL, setting)
    }

    updateSetting(setting: Setting, successMessage?: string, errorMessage?: string): Observable<Setting> {
        let subject = new Subject();
        this.apiService.put(`${SETTINGS_API_URL}/${setting.id}`, setting)
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

    removeSetting(id: string): Observable<any> {
        return this.apiService.delete(`${SETTINGS_API_URL}/${id}`)
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

    private getUpdateErrorMessage(error, errorMessage: string) {
        if (error.status === 409) {
            return 'Conflict between settings has been detected. Setting is disabled now';
        }
        return errorMessage ? errorMessage : 'Unable to update setting';
    }
}