import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Configuration} from "./entities/configuration";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

const CONFIGS_API_URL = `${environment.apiUrl}/api/settings`;

@Injectable()
export class ConfigurationsService {

    constructor(private http: Http) { }

    loadConfigs(): Observable<Response> {
        return this.http.get(CONFIGS_API_URL)
    }

    createConfiguration(config: Configuration): Observable<Response> {
        config.priority = config.priority['id'];
        return this.http.post(CONFIGS_API_URL, config);
    }

    updateConfiguration(config: Configuration): Observable<Response> {
        return this.http.put(`${CONFIGS_API_URL}/${config.id}`, config);
    }
}