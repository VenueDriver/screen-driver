import {Component, OnInit} from '@angular/core';
import {VenuesService} from "../venues/venues.service";
import {Venue} from "../venues/entities/venue";
import {MaintenanceService} from "./maintenance.service";
import {ScreensMessagingService} from "../messaging/screens-messaging.service";

import * as _ from 'lodash';

@Component({
    selector: 'maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.sass']
})
export class MaintenanceComponent implements OnInit {
    venuesTree: Array<Venue>;

    constructor(private venuesService: VenuesService,
                private screensService: ScreensMessagingService,
                private maintenanceService: MaintenanceService) {
    }

    ngOnInit() {
        this.loadVenues();
    }

    loadVenues() {
        this.venuesService.loadVenues().subscribe(venues => {
            this.venuesTree = this.venuesService.getVenuesForTree(venues);
        });
    }

    updateClientsApps(screens: any) {
        let screensIds = _.map(screens, 'id');
        let body = { screens: screensIds };

        this.screensService.updateClientApps(body);
    }
}
