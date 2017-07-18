import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Setting} from "./entities/setting";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

const SETTINGS_API_URL = `${environment.apiUrl}/api/settings`;

@Injectable()
export class SettingsService {

    constructor(private http: Http) { }

    loadSettings(): Observable<Response> {
        return this.http.get(SETTINGS_API_URL)
    }

    createSetting(setting: Setting): Observable<Response> {
        setting.priority = setting.priority['id'];
        return this.http.post(SETTINGS_API_URL, setting);
    }

    updateSetting(setting: Setting): Observable<Response> {
        return this.http.put(`${SETTINGS_API_URL}/${setting.id}`, setting);
    }
}