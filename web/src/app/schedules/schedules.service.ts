import { Injectable } from '@angular/core';
import {Schedule} from "./entities/schedule";
import {EventTime} from "./entities/event-time";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import {Setting} from "../settings/entities/setting";
import {SettingsPriorityHelper} from "../settings/settings-priority.helper";
import {Observable, Subject, BehaviorSubject} from "rxjs";

const SCHEDULES_API = `${environment.apiUrl}/api/schedules`;

@Injectable()
export class SchedulesService {

    scheduleListUpdated: Subject<any> = new BehaviorSubject<any>({});

    constructor(
        private http: Http,
        private settingPriorityHelper: SettingsPriorityHelper
    ) {
    }

    loadSchedules(): Observable<Array<Schedule>> {
        return this.http.get(SCHEDULES_API)
            .map(response => response.json());
    }

    createSchedule(setting: Setting, eventTime: EventTime) {
        let schedule = new Schedule();
        eventTime.setCronsForSchedule(schedule);
        schedule.settingId = setting ? setting.id : '';
        this.save(schedule, setting);
    }

    save(schedule: Schedule, setting: Setting) {
        this.http.post(SCHEDULES_API, schedule).subscribe(response => {
            this.scheduleListUpdated.next(response);
            this.settingPriorityHelper.setOccasionalPriorityType(setting);
        });
    }

    updateSchedule(schedule: Schedule, eventTime: EventTime) {
        eventTime.setCronsForSchedule(schedule);
        this.http.put(`${SCHEDULES_API}/${schedule.id}`, schedule).subscribe(response => {
            this.scheduleListUpdated.next(response);
        });
    }
}