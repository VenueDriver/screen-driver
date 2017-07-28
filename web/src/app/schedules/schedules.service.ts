import { Injectable } from '@angular/core';
import {DatetimeToCronConverter} from '../datetime-cron-converter/datetime-cron.converter';
import {Schedule} from "./entities/schedule";
import {EventTime} from "./entities/event-time";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";

const SCHEDULES_API = `${environment.apiUrl}/api/schedules`;

@Injectable()
export class SchedulesService {

    constructor(private http: Http) {
    }

    createSchedule(schedule: Schedule, eventTime: EventTime) {
        this.setEventTime(schedule, eventTime);
        this.save(schedule);
    }

    setEventTime(schedule: Schedule, eventTime: EventTime) {
        schedule.eventCron = this.convertToCron(eventTime.startDate, eventTime.startTime, eventTime.startTimePeriod);
        schedule.endEventCron = this.convertToCron(eventTime.endDate, eventTime.endTime, eventTime.endTimePeriod);
    }

    convertToCron(date: Date, time: string, timePeriod: string): string {
        let cron = DatetimeToCronConverter.createCronForSpecificDate(date);
        let hours = this.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.setTimeForCron(cron, hours, minutes);
    }

    getHours(time: string, timePeriod: string) {
        return new Date(`2000-01-01 ${time} ${timePeriod}`).getHours();
    }

    save(schedule: Schedule) {
        this.http.post(SCHEDULES_API, schedule).subscribe();
    }
}