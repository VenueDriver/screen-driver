import {Component, Input} from '@angular/core';
import {Venue} from "../../venues/entities/venue";

@Component({
    selector: 'venues',
    templateUrl: './venues.component.html',
    styleUrls: ['./venues.component.sass']
})
export class VenuesComponent {
    @Input() venues: Array<Venue>;

    constructor() {
    }

}
