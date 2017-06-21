import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Venue} from "../entities/venue";

@Component({
    selector: 'add-venue-form',
    templateUrl: 'add-venue-form.component.html'
})
export class AddVenueFormComponent implements OnInit {

    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();

    newVenue = new Venue();

    constructor() { }

    ngOnInit() { }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit() {
        this.submit.emit(this.newVenue);
    }
}