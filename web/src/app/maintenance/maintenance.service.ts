import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AutoupdateScheduleService} from "./autoupdate-schedule.service";
import {VenuesService} from "../venues/venues.service";

import * as _ from 'lodash';
import {VenueMaintenanceInfo} from "./entities/venue-maintenance-info";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";
import {KioskVersionService} from "./kiosk-version.service";

@Injectable()
export class MaintenanceService {

    constructor(private venuesService: VenuesService,
                private kioskVersionsService: KioskVersionService,
                private autoupdateScheduleService: AutoupdateScheduleService) {
    }

    loadData(): Observable<any> {
        return Observable.zip(
            this.loadVenues(),
            this.loadAutoupdateSchedules(),
            this.loadKioskVersions()
        );
    }

    loadAutoupdateSchedules(): Observable<any> {
        return this.autoupdateScheduleService.loadAutoupdateSchedule();
    }

    loadKioskVersions(): Observable<any> {
        return this.kioskVersionsService.loadKioskVersions();
    }

    loadVenues() {
        return this.venuesService.loadVenues();
    }

    mergeVenueWithSchedule(data: any): Array<VenueMaintenanceInfo> {
        let venues = data[0];
        let schedules = data[1];
        let schedulesMap = this.createSchedulesMap(schedules);
        _.each(venues, (v: VenueMaintenanceInfo) => this.setAutoupdateScheduleForVenue(schedulesMap, v));
        return venues;
    }

    private createSchedulesMap(schedules): any {
        let schedulesMap = {};
        _.each(schedules, s => schedulesMap[s.id] = s);
        return schedulesMap;
    }

    private setAutoupdateScheduleForVenue(schedulesMap, venue) {
        let schedule = schedulesMap[venue.id];
        if (_.isEmpty(schedule)) {
            schedule = this.createDefaultAutoapdateSchedule();
        }
        venue.autoupdateSchedule = schedule;
    }

    private createDefaultAutoapdateSchedule(): AutoupdateSchedule {
        let autoupdateSchedule = new AutoupdateSchedule();
        autoupdateSchedule.eventTime = '0 0 1 * * * *';
        return autoupdateSchedule;
    }
}
