import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AutoupdateScheduleService} from "./autoupdate-schedule.service";
import {VenuesService} from "../venues/venues.service";

import * as _ from 'lodash';
import {VenueMaintenanceInfo} from "./entities/venue-maintenance-info";
import {KioskVersionService} from "./kiosk-version.service";
import {MaintenanceProperties} from "./entities/maintenance-properties";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";
import {KioskVersionDetails, KioskVersionDetailsMap} from "./entities/kiosk-version-details";
import {Venue} from "../venues/entities/venue";

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
        ).map(this.mapResponseFromServer);
    }

    private mapResponseFromServer(data): MaintenanceProperties {
        return {
            venues: data[0],
            autoupdateSchedules: data[1],
            kioskVersions: data[2]
        }
    }

    loadAutoupdateSchedules(): Observable<Array<AutoupdateSchedule>> {
        return this.autoupdateScheduleService.loadAutoupdateSchedule();
    }

    loadKioskVersions(): Observable<KioskVersionDetailsMap> {
        return this.kioskVersionsService.loadKioskVersions();
    }

    loadVenues(): Observable<Array<Venue>> {
        return this.venuesService.loadVenues();
    }

    mergeVenueWithSchedule(venues: Array<VenueMaintenanceInfo>, schedules: Array<AutoupdateSchedule>): Array<VenueMaintenanceInfo> {
        let schedulesMap = this.autoupdateScheduleService.createSchedulesMap(schedules);
        _.each(venues, (v: VenueMaintenanceInfo) => this.setAutoupdateScheduleForVenue(schedulesMap, v));
        return venues;
    }

    private setAutoupdateScheduleForVenue(schedulesMap: any, venue: VenueMaintenanceInfo) {
        let schedule = schedulesMap[venue.id];
        if (_.isEmpty(schedule)) {
            schedule = this.autoupdateScheduleService.createDefaultAutoapdateSchedule();
        }
        venue.autoupdateSchedule = schedule;
    }

}
