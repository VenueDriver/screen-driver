import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AutoupdateScheduleService} from "./autoupdate-schedule.service";
import {VenuesService} from "../venues/venues.service";

@Injectable()
export class MaintenanceService {

    readonly screensApiPath = `${environment.apiUrl}/api/screens`;

    constructor(private httpClient: HttpClient,
                private venuesService: VenuesService,
                private autoupdateScheduleService: AutoupdateScheduleService) {
    }

    loadData(): Observable<any> {
        return Observable.zip(
            this.loadVenues(),
            this.loadAutoupdateSchedules()
        );
    }

    loadAutoupdateSchedules(): Observable<any> {
        return this.autoupdateScheduleService.loadAutoupdateSchedule();
    }

    loadVenues() {
        return this.venuesService.loadVenues();
    }
}
