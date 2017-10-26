import {Component, OnInit} from '@angular/core';
import {VenuesService} from "../venues/venues.service";
import {Venue} from "../venues/entities/venue";
import {MaintenanceService} from "./maintenance.service";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";
import {VenueMaintenanceInfo} from "./entities/venue-maintenance-info";
import {KioskVersion} from "./entities/kiosk-version";
import {ScreensMessagingService} from "../messaging/screens-messaging.service";

import * as _ from 'lodash';
import {MaintenanceProperties} from "./entities/maintenance-properties";
import {NotificationService} from "../notifications/notification.service";

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
                private notificationService: NotificationService,
                private venuesService: VenuesService) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.maintenanceService.loadData().subscribe(data => this.handleResponse(data));
    }

    handleResponse(maintenanceProperties: MaintenanceProperties) {
        this.venues = maintenanceProperties.venues as Array<VenueMaintenanceInfo>;
        this.schedules = maintenanceProperties.autoupdateSchedules as Array<AutoupdateSchedule>;
        this.kioskVersions = maintenanceProperties.kioskVersions;
        let venuesMaintenanceInfo = this.maintenanceService.mergeVenueWithSchedule(this.venues, this.schedules);
        this.venuesTree = this.venuesService.getVenuesForTree(venuesMaintenanceInfo);
    }

    updateClientsApps(screens: any) {
        let screensIds = _.map(screens, 'id');
        let body = { screens: screensIds };

        this.screensService.updateClientApps(body);
    }

    updateScheduleConfiguration(autoUpdateSchedule: AutoupdateSchedule): void {
        this.maintenanceService.updateVenueSchedule(autoUpdateSchedule)
            .subscribe((ok) => {
                this.notificationService.showSuccessNotificationBar('Configuration has been successfully updated')
            }, (error) => {
                this.notificationService.showErrorNotificationBar('Unable to update schedule configuration')
            });
    }
}
