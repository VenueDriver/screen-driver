import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SpinnerService} from "../spinner/spinner.service";
import {RequestConfig} from "./configs/request-config";

@Injectable()
export class ApiService {
    constructor(
        private http: HttpClient,
        private spinnerService: SpinnerService
    ) {}

    private setHeaders(): HttpHeaders {
      const headersConfig = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      return new HttpHeaders(headersConfig);
    }

    private formatErrors(error: any) {
        return Observable.throw(error);
    }

    private applyRequestConfigs(requestConfig: RequestConfig) {
        if (requestConfig.spinner) {
            let spinnerTitle = requestConfig.spinner.name;

            let spinnerStatus = this.spinnerService.isShown(spinnerTitle);
            if (spinnerStatus) {
                this.spinnerService.hide(spinnerTitle)
            } else {
                this.spinnerService.show(spinnerTitle)
            }
        }
    }

    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(`${environment.apiUrl}${path}`, { headers: this.setHeaders(), params: params })
            .catch(this.formatErrors);
    }

    put(path: string, body: Object = {}, requestConfig: RequestConfig = {}): Observable<any> {
        this.applyRequestConfigs(requestConfig);

        return this.http.put(`${environment.apiUrl}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
            .map(() => this.applyRequestConfigs(requestConfig))
            .catch(this.formatErrors);
    }

    patch(path: string, body: Object = {}, requestConfig: RequestConfig = {}): Observable<any> {
        this.applyRequestConfigs(requestConfig);

        return this.http.patch(`${environment.apiUrl}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
            .map(() => this.applyRequestConfigs(requestConfig))
            .catch(this.formatErrors);
    }

    post(path: string, body: Object = {}, requestConfig: RequestConfig = {}): Observable<any> {
        return this.http.post(`${environment.apiUrl}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
            .map(() => this.applyRequestConfigs(requestConfig))
            .catch(this.formatErrors);
    }

    delete(path, requestConfig: RequestConfig = {}): Observable<any> {
        return this.http.delete(`${environment.apiUrl}${path}`, { headers: this.setHeaders() })
            .map(() => this.applyRequestConfigs(requestConfig))
            .catch(this.formatErrors);
    }
}
