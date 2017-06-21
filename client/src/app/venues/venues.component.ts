import { Component, OnInit } from '@angular/core';
import {VenuesService} from "./venues.service";

@Component({
    selector: 'venues',
    templateUrl: 'venues.component.html',
    styleUrls: ['venues.component.sass'],
    providers: [VenuesService]
})
export class VenuesComponent implements OnInit {

    venues;
    isShowAddVenueForm = false;

    constructor(private venuesService: VenuesService) { }

    ngOnInit() {
        this.venuesService.loadVenues().subscribe(response => {
            this.venues = this.venuesService.getVenuesForTree(response.json());
        });
    }

    showAddVenueForm() {
        this.isShowAddVenueForm = true;
    }

}
