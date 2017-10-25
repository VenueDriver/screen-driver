import {Component, OnInit} from '@angular/core';
import {Venue} from "../venues/entities/venue";
import {MaintenanceService} from "./maintenance.service";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";
import {VenueMaintenanceInfo} from "./entities/venue-maintenance-info";

@Component({
    selector: 'maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.sass']
})
export class MaintenanceComponent implements OnInit {

    venues: Array<Venue>;
    schedules: Array<AutoupdateSchedule>;
    venuesMaintenanceInfo: Array<VenueMaintenanceInfo>;

    constructor(private maintenanceService: MaintenanceService) {
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
        this.venuesMaintenanceInfo = this.maintenanceService.mergeVenueWithSchedule(data);
    }

}
