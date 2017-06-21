import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {Venue} from "../entities/venue";

import * as _ from 'lodash';

@Component({
    selector: 'add-venue-form',
    templateUrl: 'add-venue-form.component.html'
})
export class AddVenueFormComponent implements OnInit {

    @Input() venues: any;
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();

    newVenue = new Venue();
    errorMessage: string;

    constructor() { }

    ngOnInit() { }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit() {
        this.submit.emit(this.newVenue);
    }

    isValid() {
        return !_.isEmpty(this.newVenue.name)
            && this.hasUniqueName();
    }

    hasUniqueName() {
        return !_.includes(_.map(this.venues, venue => venue.name), this.newVenue.name);
    }
}