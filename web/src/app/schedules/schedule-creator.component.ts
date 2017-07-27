import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'schedule-creator',
    templateUrl: 'schedule-creator.component.html',
    styleUrls: ['schedule-creator.component.sass']
})
export class ScheduleCreatorComponent implements OnInit {

    timeItems: Array<string> = [];
    timePeriods = ['AM', 'PM'];

    date = new Date();
    time = {
        startTime: '8:00',
        startTimePeriod: 'AM',
        endTime: '1:00',
        endTimePeriod: 'PM'
    };

    constructor() {
        this.generateTimeItems();
    }

    generateTimeItems() {
        for (let i = 1; i <= 12; i++) {
            this.timeItems.push(`${i}:00`, `${i}:30`);
        }
    }

    ngOnInit() { }

    setTime(field: string, time: string) {
        this.time[field] = time;
    }

    performSubmit() {

    }

    performCancel() {

    }

}