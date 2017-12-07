import { Injectable } from '@angular/core';
import {Schedule} from "./models/schedule.model";
import {environment} from "../../../environments/environment";
import {Setting} from "../../settings/entities/setting";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {getPropertyName} from '../../core/enums/periodicity';
import {NotificationService} from "../../shared/notifications/notification.service";
import {EventTimeHolder} from "./event-time/event-time.holder";
import {ApiService} from "../../shared/services/api.service";

import {RequestConfig} from "../../shared/services/configs/request-config";
import {SpinnerNameUtils} from "../../shared/spinner/uniq-entity-spinner/spinner-name-utils";

const SCHEDULES_API = `/api/schedules`;
const CONFLICT_IN_SETTINGS_STATUS = 409;

@Injectable()
export class SchedulesService {

    scheduleListUpdated: Subject<any> = new BehaviorSubject<any>({});
    schedules: Subject<Array<Schedule>> = new BehaviorSubject<Array<Schedule>>([]);

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService) {
    }

    loadSchedules(): Observable<Array<Schedule>> {
        return this.apiService.get(SCHEDULES_API)
            .map((response: Array<Schedule>) => {
                this.schedules.next(response);
                return response;
            });
    }

    createSchedule(setting: Setting, eventTimeHolder: EventTimeHolder) {
        let schedule = new Schedule();
        schedule.settingId = setting ? setting.id : '';
        this.updateEventProperties(eventTimeHolder, schedule);
        this.save(schedule);
    }

    updateSchedule(schedule: Schedule, eventTimeHolder?: EventTimeHolder) {
        if (eventTimeHolder) {
            this.updateEventProperties(eventTimeHolder, schedule);
        }
        this.performUpdate(schedule);
    }

    removeSchedule(schedule: Schedule) {
        this.apiService.delete(`${SCHEDULES_API}/${schedule.id}`).subscribe(
            response => this.scheduleListUpdated.next(response),
            error => this.notificationService.showErrorNotificationBar('Unable to perform the remove schedule operation')
        );
    }

    private save(schedule: Schedule) {
        this.apiService.post(SCHEDULES_API, schedule, this.requestConfigFor(schedule)).subscribe(
            response => this.handleResponseWithSchedule(response),
            error => {
                let errorMessage = this.getCreateErrorMessage(error);
                this.notificationService.showErrorNotificationBar(errorMessage);
                if (error.status === CONFLICT_IN_SETTINGS_STATUS) {
                    this.handleResponseWithSchedule(error._body);
                }
            }
        );
    }

    private handleResponseWithSchedule(schedule: any) {
        this.scheduleListUpdated.next(schedule);
    }

    private updateEventProperties(eventTimeHolder: EventTimeHolder, schedule: Schedule) {
        eventTimeHolder.setCronsForSchedule(schedule);
        schedule.periodicity = getPropertyName(eventTimeHolder.getPeriodicity());
    }

    private performUpdate(schedule: Schedule) {
        let request = this.apiService.put(`${SCHEDULES_API}/${schedule.id}`, schedule, this.requestConfigFor(schedule));

        request.subscribe(
            response => this.handleResponseWithSchedule(response),
            error => this.handleErrors(error)
        );
    }

    private handleErrors(errors) {
        let errorMessage = this.getUpdateErrorMessage(errors);
        this.notificationService.showErrorNotificationBar(errorMessage);
        if (errors.status === CONFLICT_IN_SETTINGS_STATUS) {
            this.handleResponseWithSchedule(errors.body);
        }
    }

    private requestConfigFor(schedule: Schedule): RequestConfig {
        return {spinner: {name: SpinnerNameUtils.getName(schedule, "schedules")}};
    }

    private getUpdateErrorMessage(error) {
        if (error.status === CONFLICT_IN_SETTINGS_STATUS) {
            return 'Conflict between schedules has been detected. Schedule is disabled now';
        }
        return 'Unable to perform the update schedule operation';
    }

    private getCreateErrorMessage(error) {
        if (error.status === CONFLICT_IN_SETTINGS_STATUS) {
            return 'Conflict between schedules has been detected. Schedule saved as disabled now';
        }
        return 'Unable to perform the create schedule operation';
    }
}
