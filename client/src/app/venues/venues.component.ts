import { Component, OnInit } from '@angular/core';
import {VenuesService} from "./venues.service";
import {Venue} from "./entities/venue";

@Component({
    selector: 'venues',
    templateUrl: 'venues.component.html',
    styleUrls: ['venues.component.sass'],
    providers: [VenuesService]
})
export class VenuesComponent implements OnInit {

    venues: Venue[];
    venuesTree: any;
    isShowAddVenueForm = false;

    constructor(private venuesService: VenuesService) { }

    ngOnInit() {
        this.loadVenues();
    }

    loadVenues() {
        this.venuesService.loadVenues().subscribe(response => {
            this.venues = response.json();
            this.venuesTree = this.venuesService.getVenuesForTree(this.venues);
        });
    }

    showAddVenueForm() {
        this.isShowAddVenueForm = true;
    }

    hideAddVenueForm() {
        this.isShowAddVenueForm = false;
    }

    addVenue(venue: Venue) {
        this.venuesService.saveVenue(venue)
            .subscribe(response => this.handleResponse(response));
    }

    handleResponse(response: any) {
        if (response.ok) {
            this.hideAddVenueForm();
        }
        this.loadVenues();
    }
}
