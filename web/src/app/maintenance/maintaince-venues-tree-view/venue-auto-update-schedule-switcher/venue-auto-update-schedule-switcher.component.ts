import {Component, EventEmitter, Output} from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'auto-update-schedule-switcher',
    templateUrl: 'venue-auto-update-schedule-switcher.component.html',
    styleUrls: ['./venue-auto-update-schedule-switcher.component.sass']
})
export class VenueAutoUpdateScheduleSwitcherComponent {

    public defaultTime: { time: string, period: string } = {time: '08:00', period: 'AM'};

    @Output() timeChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(
    ) { }

    onTimePeriodChange(val: any): void {
        console.log(val);
    }

    onTimeChange(val: any): void {
        console.log(val);
    }
}