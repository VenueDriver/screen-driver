import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";

@Injectable()
export class MaintenanceService {
    readonly screensApiPath = `${environment.apiUrl}/api/screens`;

    constructor(private httpClient: HttpClient) {
    }

    getAutoupdateSchedules(): Observable<any> {
        return this.httpClient.get(this.screensApiPath + '/update-schedule')
    }

    putAutoupdateSchedules(schedule: AutoupdateSchedule): Observable<any> {
        return this.httpClient.put(this.screensApiPath + '/update-schedule', schedule)
    }
}
