import {Component, OnInit} from '@angular/core';
import {VenuesService} from "../venues/venues.service";
import {Venue} from "../venues/entities/venue";
import {MaintenanceService} from "./maintenance.service";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";
import {VenueMaintenanceInfo} from "./entities/venue-maintenance-info";
import {KioskVersion} from "./entities/kiosk-version";
import {ScreensMessagingService} from "../messaging/screens-messaging.service";

import * as _ from 'lodash';

@Component({
    selector: 'maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.sass']
})
export class MaintenanceComponent implements OnInit {

    venues: Array<VenueMaintenanceInfo>;
    venuesTree: Array<Venue>;
    schedules: Array<AutoupdateSchedule>;
    kioskVersions: Array<KioskVersion>;

    constructor(private maintenanceService: MaintenanceService,
                private screensService: ScreensMessagingService,
                private venuesService: VenuesService) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.maintenanceService.loadData().subscribe(data => this.handleResponse(data));
    }

    handleResponse(data) {
        this.venues = data[0];
        this.schedules = data[1];
        this.kioskVersions = data[2];
        let venuesMaintenanceInfo = this.maintenanceService.mergeVenueWithSchedule(data);
        this.venuesTree = this.venuesService.getVenuesForTree(venuesMaintenanceInfo);
    }

    updateClientsApps(screens: any) {
        let screensIds = _.map(screens, 'id');
        let body = { screens: screensIds };

        this.screensService.updateClientApps(body);
    }
}
