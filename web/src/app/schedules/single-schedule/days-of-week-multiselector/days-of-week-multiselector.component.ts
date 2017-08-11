import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {DaysOfWeek} from '../../../enums/days-of-week';

import * as _ from 'lodash';


@Component({
    selector: 'date-multiselector',
    templateUrl: 'days-of-week-multiselector.component.html',
    styleUrls: ['days-of-week-multiselector.component.sass']
})
export class DateMultiselectorComponent implements OnInit {
    @Output() selected = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    getDaysOfWeek() {
        let daysOfWeek = [];

        for (let dayOfWeek in DaysOfWeek) {
            daysOfWeek.push({title: DaysOfWeek[dayOfWeek].substring(0, 3), selected: true});
        }

        return daysOfWeek;
    }

    onSelectedDaysOfWeekChanged(daysOfWeek) {
        let selectedDays = daysOfWeek.filter(day => day.selected);
        selectedDays = selectedDays.map(day => day.title.toUpperCase());
        this.selected.emit(selectedDays.join(','))
    }
}
