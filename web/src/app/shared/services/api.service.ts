import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SpinnerService} from "../spinner/spinner.service";
import {RequestConfig} from "./configs/request-config";
import {DataLoadingMonitorService} from "./data-loading-monitor/data-loading-monitor.service";

@Injectable()
export class ApiService {
    constructor(
        private http: HttpClient,
        private spinnerService: SpinnerService,
        private dataLoadingMonitorService: DataLoadingMonitorService
    ) {}

    get(path: string, params: HttpParams = new HttpParams(), requestConfig: RequestConfig = {}): Observable<any> {
        this.applyRequestConfigs(requestConfig);

         let request = this.http.get(this.getRequestUrl(path), { headers: this.setHeaders(), params: params });
         this.dataLoadingMonitorService.registerRequest(request);

         return this.handleRequest(request, requestConfig);
    }

    put(path: string, body: Object = {}, requestConfig: RequestConfig = {}): Observable<any> {
        this.applyRequestConfigs(requestConfig);

        let request = this.http.put(this.getRequestUrl(path), JSON.stringify(body), { headers: this.setHeaders() });

        return this.handleRequest(request, requestConfig);
    }

    patch(path: string, body: Object = {}, requestConfig: RequestConfig = {}): Observable<any> {
        this.applyRequestConfigs(requestConfig);

        let request = this.http.patch(this.getRequestUrl(path), JSON.stringify(body), { headers: this.setHeaders() });

        return this.handleRequest(request, requestConfig);
    }

    post(path: string, body: Object = {}, requestConfig: RequestConfig = {}): Observable<any> {
        this.applyRequestConfigs(requestConfig);

        let request = this.http.post(this.getRequestUrl(path), JSON.stringify(body), { headers: this.setHeaders() });

        return this.handleRequest(request, requestConfig);
    }

    delete(path, requestConfig: RequestConfig = {}): Observable<any> {
        this.applyRequestConfigs(requestConfig);

        let request = this.http.delete(this.getRequestUrl(path), { headers: this.setHeaders() });

        return this.handleRequest(request, requestConfig);            
    }

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
    
    private handleRequest(req: Observable<any>, requestConfig: RequestConfig) {
       return req.map(response => {
           this.disableRequestConfigs(requestConfig);
           this.dataLoadingMonitorService.registerRequestEnding(req);
           return response
       }).catch(this.formatErrors);
    }

    private applyRequestConfigs(requestConfig: RequestConfig) {
        if (requestConfig.spinner) {
            let spinnerTitle = requestConfig.spinner.name;

            this.spinnerService.show(spinnerTitle)
        }
    }

    private disableRequestConfigs(requestConfig: RequestConfig) {
        if (requestConfig.spinner) {
            let spinnerTitle = requestConfig.spinner.name;

            this.spinnerService.hide(spinnerTitle)
        }
    }

    private getRequestUrl(path: string) {
        return `${environment.apiUrl}${path}`
    }
}
