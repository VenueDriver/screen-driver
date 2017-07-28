import { Injectable } from '@angular/core';
import {DatetimeToCronConverter} from '../datetime-cron-converter/datetime-cron.converter';
import {Schedule} from "./entities/schedule";
import {EventTime} from "./entities/event-time";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import {Setting} from "../settings/entities/setting";
import {SettingsPriorityHelper} from "../settings/settings-priority.helper";

const SCHEDULES_API = `${environment.apiUrl}/api/schedules`;

@Injectable()
export class SchedulesService {

    constructor(
        private http: Http,
        private settingPriorityHelper: SettingsPriorityHelper
    ) {
    }

    createSchedule(schedule: Schedule, setting: Setting, eventTime: EventTime) {
        this.setEventTime(schedule, eventTime);
        this.save(schedule, setting);
    }

    setEventTime(schedule: Schedule, eventTime: EventTime) {
        schedule.eventCron = this.convertToCron(eventTime.startDate, eventTime.startTime, eventTime.startTimePeriod);
        schedule.endEventCron = this.convertToCron(eventTime.endDate, eventTime.endTime, eventTime.endTimePeriod);
    }

    convertToCron(date: Date, time: string, timePeriod: string): string {
        let cron = DatetimeToCronConverter.createCronForSpecificDate(date);
        let hours = EventTime.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.setTimeForCron(cron, hours, minutes);
    }

    save(schedule: Schedule, setting: Setting) {
        schedule.settingId = setting ? setting.id : '';
        this.http.post(SCHEDULES_API, schedule).subscribe(response => {
            this.settingPriorityHelper.setOccasionalPriorityType(setting);
        });
    }
}