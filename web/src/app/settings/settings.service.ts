import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Setting} from "./entities/setting";
import {environment} from "../../environments/environment";
import {Observable, BehaviorSubject} from "rxjs";

const SETTINGS_API_URL = `${environment.apiUrl}/api/settings`;

@Injectable()
export class SettingsService {

    private createSettingEvent: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private http: Http) { }

    loadSettings(): Observable<Response> {
        return this.http.get(SETTINGS_API_URL)
    }

    createSetting(setting: Setting): Observable<Setting> {
        return this.http.post(SETTINGS_API_URL, setting)
            .map(response => response.json());
    }

    updateSetting(setting: Setting): Observable<Setting> {
        return this.http.put(`${SETTINGS_API_URL}/${setting.id}`, setting)
            .map(response => response.json());
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