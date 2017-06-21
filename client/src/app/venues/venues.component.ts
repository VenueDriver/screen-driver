import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'venues',
    templateUrl: 'venues.component.html',
    styleUrls: ['venues.component.sass']
})
export class VenuesComponent implements OnInit {

    isShowAddVenueForm = false;

    constructor() { }

    ngOnInit() { }

    showAddVenueForm() {
        this.isShowAddVenueForm = true;
    }

}
