import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'schedule-creator',
    templateUrl: 'schedule-creator.component.html',
    styleUrls: ['schedule-creator.component.sass']
})
export class ScheduleCreatorComponent implements OnInit {

    date = new Date();
    timeItems: Array<string> = [];
    timePeriods = ['AM', 'PM'];

    constructor() {
        this.generateTimeItems();
    }

    generateTimeItems() {
        for (let i = 1; i <= 12; i++) {
            this.timeItems.push(`${i}:00`, `${i}:30`);
        }
    }

    ngOnInit() { }

}