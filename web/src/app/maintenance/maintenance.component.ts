import {Component, OnInit} from '@angular/core';
import {VenuesService} from "../venues/venues.service";
import {Venue} from "../venues/entities/venue";
import {MaintenanceService} from "./maintenance.service";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";

@Component({
    selector: 'maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.sass']
})
export class MaintenanceComponent implements OnInit {
    venues: Array<Venue>;
    schedules: Array<AutoupdateSchedule>;

    constructor(private venuesService: VenuesService,
                private maintenanceService: MaintenanceService) {
    }

    ngOnInit() {
        this.loadVenues();
        this.loadSchedules();
    }

    loadVenues() {
        this.venuesService.loadVenues().subscribe(venues => {
            this.venues = venues;
        });
    }

    loadSchedules() {
        this.maintenanceService.getAutoupdateSchedules().subscribe(
            data => this.schedules = data
        )
    };

}
