import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AutoupdateScheduleService {

    readonly screensApiPath = `${environment.apiUrl}/api/screens`;


    constructor(private httpClient: HttpClient) {

    }

    loadAutoupdateSchedule(): Observable<any> {
        return this.httpClient.get(this.screensApiPath + '/update-schedule')
    }
}