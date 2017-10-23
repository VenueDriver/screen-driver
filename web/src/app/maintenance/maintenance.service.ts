import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class MaintenanceService {
    readonly screensApiPath = `${environment.apiUrl}/api/screens`;

    constructor(private httpClient: HttpClient) {
    }

    getAutoupdateSchedules(): Observable<any> {
        return this.httpClient.get(this.screensApiPath + '/update-schedule')
    }
}
