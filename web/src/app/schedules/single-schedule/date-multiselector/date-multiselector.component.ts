import {Component, OnInit, Input} from '@angular/core';
import {DaysOfWeek} from '../../../enums/days-of-week';

import * as _ from 'lodash';


@Component({
    selector: 'date-multiselector',
    templateUrl: './date-multiselector.component.html',
    styleUrls: ['./date-multiselector.component.sass']
})
export class DateMultiselectorComponent implements OnInit {

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

    onSelectedDateChanged(data) {
        console.log(data);
    }
}
