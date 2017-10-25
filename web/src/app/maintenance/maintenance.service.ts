import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AutoupdateScheduleService} from "./autoupdate-schedule.service";
import {VenuesService} from "../venues/venues.service";

import * as _ from 'lodash';
import {VenueMaintenanceInfo} from "./entities/venue-maintenance-info";
import {KioskVersionService} from "./kiosk-version.service";
import {MaintenanceProperties} from "./entities/maintenance-properties";

@Injectable()
export class MaintenanceService {

    constructor(private venuesService: VenuesService,
                private kioskVersionsService: KioskVersionService,
                private autoupdateScheduleService: AutoupdateScheduleService) {
    }

    loadData(): Observable<MaintenanceProperties> {
        return Observable.zip(
            this.loadVenues(),
            this.loadAutoupdateSchedules(),
            this.loadKioskVersions()
        ).map(data => this.mapResponseFromServer(data));
    }

    private mapResponseFromServer(data): MaintenanceProperties {
        return {
            venues: data[0],
            autoupdateSchedules: data[1],
            kioskVersions: data[2]
        }
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

    mergeVenueWithSchedule(maintenanceProperties: MaintenanceProperties): Array<VenueMaintenanceInfo> {
        let venues = maintenanceProperties.venues;
        let schedules = maintenanceProperties.autoupdateSchedules;
        let schedulesMap = this.autoupdateScheduleService.createSchedulesMap(schedules);
        _.each(venues, (v: VenueMaintenanceInfo) => this.setAutoupdateScheduleForVenue(schedulesMap, v));
        return venues;
    }

    private setAutoupdateScheduleForVenue(schedulesMap, venue) {
        let schedule = schedulesMap[venue.id];
        if (_.isEmpty(schedule)) {
            schedule = this.autoupdateScheduleService.createDefaultAutoapdateSchedule();
        }
        venue.autoupdateSchedule = schedule;
    }

}
