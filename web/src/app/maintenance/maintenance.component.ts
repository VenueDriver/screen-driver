import {Component, OnInit} from '@angular/core';
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

    constructor(private maintenanceService: MaintenanceService) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.maintenanceService.loadData().subscribe(data => {
            this.venues = data[0];
            this.schedules = data[1];
        })
    }


}
