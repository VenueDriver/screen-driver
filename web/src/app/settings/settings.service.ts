import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Setting} from "./entities/setting";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

const CONFIGS_API_URL = `${environment.apiUrl}/api/configs`;

@Injectable()
export class SettingsService {

    constructor(private http: Http) { }

    loadSettings(): Observable<Response> {
        return this.http.get(CONFIGS_API_URL)
    }

    createSetting(setting: Setting): Observable<Response> {
        setting.priority = setting.priority['id'];
        return this.http.post(CONFIGS_API_URL, setting);
    }

    updateSetting(setting: Setting): Observable<Response> {
        return this.http.put(`${CONFIGS_API_URL}/${setting.id}`, setting);
    }
}