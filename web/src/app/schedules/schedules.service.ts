import { Injectable } from '@angular/core';
import {Schedule} from "./entities/schedule";
import {EventTime} from "./entities/event-time";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import {Setting} from "../settings/entities/setting";
import {SettingsPriorityHelper} from "../settings/settings-priority.helper";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {getPropertyName} from '../enums/periodicity';
import {NotificationService} from "../notifications/notification.service";

const SCHEDULES_API = `${environment.apiUrl}/api/schedules`;

@Injectable()
export class SchedulesService {

    scheduleListUpdated: Subject<any> = new BehaviorSubject<any>({});
    schedules: BehaviorSubject<Schedule[]> = new BehaviorSubject<Schedule[]>([]);

    constructor(
        private http: Http,
        private settingPriorityHelper: SettingsPriorityHelper,
        private notificationService: NotificationService,
    ) {
    }

    loadSchedules(): Observable<Array<Schedule>> {
        return this.http.get(SCHEDULES_API)
            .map(response => {
                let schedules = response.json();
                this.schedules.next(schedules);
                return schedules;
            });
    }

    createSchedule(setting: Setting, eventTime: EventTime) {
        let schedule = new Schedule();
        eventTime.setCronsForSchedule(schedule);
        schedule.settingId = setting ? setting.id : '';
        schedule.periodicity = getPropertyName(eventTime.periodicity);
        this.save(schedule, setting);
    }

    save(schedule: Schedule, setting: Setting) {
        this.http.post(SCHEDULES_API, schedule).subscribe(
            response => this.handleSaveResponse(response, setting),
            error => {
                let errorMessage = this.getCreateErrorMessage(error);
                this.notificationService.showErrorNotificationBar(errorMessage);
                if (error.status === 409) {
                    this.handleSaveResponse(error._body, setting);
                }
            }
        );
    }

    handleSaveResponse(schedule: any, setting: Setting) {
        this.scheduleListUpdated.next(schedule);
        this.settingPriorityHelper.setPriorityType(setting, schedule);
    }

    updateSchedule(schedule: Schedule, eventTime?: EventTime) {
        if (eventTime) {
            eventTime.setCronsForSchedule(schedule);
            schedule.periodicity = getPropertyName(eventTime.periodicity);
        }
        this.http.put(`${SCHEDULES_API}/${schedule.id}`, schedule).subscribe(
            response => this.scheduleListUpdated.next(response),
            error => {
                let errorMessage = this.getUpdateErrorMessage(error);
                this.notificationService.showErrorNotificationBar(errorMessage);
                if (error.status === 409) {
                    this.scheduleListUpdated.next(error.body);
                }
            }
        );
    }

    removeSchedule(schedule: Schedule) {
        this.http.delete(`${SCHEDULES_API}/${schedule.id}`).subscribe(
            response => this.scheduleListUpdated.next(response),
            error => this.notificationService.showErrorNotificationBar('Unable to perform the remove schedule operation')
        );
    }

    getUpdateErrorMessage(error) {
        if (error.status === 409) {
            return 'Conflict between schedules has been detected. Schedule is disabled now';
        }
        return 'Unable to perform the update schedule operation';
    }

    getCreateErrorMessage(error) {
        if (error.status === 409) {
            return 'Conflict between schedules has been detected. Schedule saved as disabled now';
        }
        return 'Unable to perform the create schedule operation';
    }
}