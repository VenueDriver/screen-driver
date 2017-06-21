import { Component, OnInit } from '@angular/core';
import {VenuesService} from "./venues.service";

@Component({
    selector: 'venues',
    templateUrl: 'venues.component.html',
    providers: [VenuesService]
})
export class VenuesComponent implements OnInit {

    constructor(private venuesService: VenuesService) { }

    ngOnInit() {
        // this.venuesService.loadVenues();
    }

}
