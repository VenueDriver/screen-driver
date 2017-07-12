import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Configuration} from "./entities/configuration";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

const CONFIGS_API_URL = `${environment.apiUrl}/api/configs`;

@Injectable()
export class ConfigurationsService {

    constructor(private http: Http) { }

    createConfiguration(config: Configuration): Observable<Response> {
        return this.http.post(CONFIGS_API_URL, config);
    }
}