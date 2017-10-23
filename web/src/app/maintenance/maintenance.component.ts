import {Component, OnInit} from '@angular/core';
import {VenuesService} from "../venues/venues.service";
import {Venue} from "../venues/entities/venue";

@Component({
    selector: 'maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.sass']
})
export class MaintenanceComponent implements OnInit {
    venues: Array<Venue>;

    constructor(private venuesService: VenuesService) {
    }

    ngOnInit() {
        this.loadVenues();
    }

    loadVenues() {
        this.venuesService.loadVenues().subscribe(venues => {
            this.venues = venues;
        });
    }

}
