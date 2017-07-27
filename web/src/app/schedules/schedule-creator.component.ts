import { Component, OnInit } from '@angular/core';
import {SchedulesService} from "./schedules.service";
import {Schedule} from "./schedule";
import {EventTime} from "./event-time";

@Component({
    selector: 'schedule-creator',
    templateUrl: 'schedule-creator.component.html',
    styleUrls: ['schedule-creator.component.sass']
})
export class ScheduleCreatorComponent implements OnInit {

    schedule = new Schedule();
    eventTime = new EventTime();

    timeItems: Array<string> = [];
    timePeriods = ['AM', 'PM'];

    constructor(private schedulesService: SchedulesService) {
        this.generateTimeItems();
    }

    ngOnInit() { }

    generateTimeItems() {
        for (let i = 1; i <= 12; i++) {
            this.timeItems.push(`${i}:00`, `${i}:30`);
        }
    }

    setTime(field: string, time: string) {
        this.eventTime[field] = time;
    }

    performSubmit() {
        this.schedulesService.createSchedule(this.schedule, this.eventTime);
    }

    performCancel() {

    }

}