import { Injectable } from '@angular/core';
import {Schedule} from "./models/schedule.model";
import {environment} from "../../../environments/environment";
import {Setting} from "../../settings/entities/setting";
import {SettingsPriorityHelper} from "../../settings/settings-priority.helper";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {getPropertyName} from '../../core/enums/periodicity';
import {NotificationService} from "../../shared/notifications/notification.service";
import {HttpClient} from "@angular/common/http";
import {EventTimeHolder} from "./event-time/event-time.holder";

const SCHEDULES_API = `${environment.apiUrl}/api/schedules`;

@Injectable()
export class SchedulesService {

    scheduleListUpdated: Subject<any> = new BehaviorSubject<any>({});
    schedules: BehaviorSubject<Array<Schedule>> = new BehaviorSubject<Array<Schedule>>([]);

    constructor(
        private httpClient: HttpClient,
        private settingPriorityHelper: SettingsPriorityHelper,
        private notificationService: NotificationService,
    ) {
    }

    loadSchedules(): Observable<Array<Schedule>> {
        return this.httpClient.get(SCHEDULES_API)
            .map((response: Array<Schedule>) => {
                this.schedules.next(response);
                return response;
            });
    }

    createSchedule(setting: Setting, eventTimeHolder: EventTimeHolder) {
        let schedule = new Schedule();
        eventTimeHolder.setCronsForSchedule(schedule);
        schedule.settingId = setting ? setting.id : '';
        schedule.periodicity = getPropertyName(eventTimeHolder.getPeriodicity());
        this.save(schedule, setting);
    }

    save(schedule: Schedule, setting: Setting) {
        this.httpClient.post(SCHEDULES_API, schedule).subscribe(
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

    updateSchedule(schedule: Schedule, eventTimeHolder?: EventTimeHolder) {
        if (eventTimeHolder) {
            eventTimeHolder.setCronsForSchedule(schedule);
            schedule.periodicity = getPropertyName(eventTimeHolder.getPeriodicity());
        }
        this.httpClient.put(`${SCHEDULES_API}/${schedule.id}`, schedule).subscribe(
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
        this.httpClient.delete(`${SCHEDULES_API}/${schedule.id}`).subscribe(
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
