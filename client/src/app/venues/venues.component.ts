import { Component, OnInit } from '@angular/core';
import {VenuesService} from "./venues.service";

@Component({
    selector: 'venues',
    templateUrl: 'venues.component.html',
    styleUrls: ['venues.component.sass'],
    providers: [VenuesService]
})
export class VenuesComponent implements OnInit {

    isShowAddVenueForm = false;

    constructor(private venuesService: VenuesService) { }

    ngOnInit() {
        // this.venuesService.loadVenues();
    }

    showAddVenueForm() {
        this.isShowAddVenueForm = true;
    }

}
