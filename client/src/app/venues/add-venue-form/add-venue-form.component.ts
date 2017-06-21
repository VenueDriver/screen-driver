import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'add-venue-form',
    templateUrl: 'add-venue-form.component.html'
})
export class AddVenueFormComponent implements OnInit {

    @Output() cancel = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onCancel() {
        this.cancel.emit();
    }
}