import { Injectable } from '@angular/core';
import {Schedule} from "./models/schedule.model";
import {Setting} from "../../settings/entities/setting";
import {SettingsPriorityHelper} from "../../settings/settings-priority.helper";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {getPropertyName} from '../../core/enums/periodicity';
import {NotificationService} from "../../shared/notifications/notification.service";
import {EventTimeHolder} from "./event-time/event-time.holder";
import {ApiService} from "../../shared/services/api.service";

import {RequestConfig} from "../../shared/services/configs/request-config";
import {SpinnerNameUtils} from "../../shared/spinner/uniq-entity-spinner/spinner-name-utils";

const SCHEDULES_API = `/api/schedules`;

@Injectable()
export class SchedulesService {

    scheduleListUpdated: Subject<any> = new BehaviorSubject<any>({});
    schedules: BehaviorSubject<Array<Schedule>> = new BehaviorSubject<Array<Schedule>>([]);

    constructor(
        private apiService: ApiService,
        private settingPriorityHelper: SettingsPriorityHelper,
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
        eventTimeHolder.setCronsForSchedule(schedule);
        schedule.settingId = setting ? setting.id : '';
        schedule.periodicity = getPropertyName(eventTimeHolder.getPeriodicity());
        this.save(schedule, setting);
    }

    save(schedule: Schedule, setting: Setting) {
        this.apiService.post(SCHEDULES_API, schedule, this.requestConfigFor(schedule)).subscribe(
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

    updateSchedule(schedule: Schedule, eventTimeHolder?: EventTimeHolder){
        if (eventTimeHolder) {
            eventTimeHolder.setCronsForSchedule(schedule);
            schedule.periodicity = getPropertyName(eventTimeHolder.getPeriodicity());
        }

        let request = this.apiService.put(`${SCHEDULES_API}/${schedule.id}`, schedule, this.requestConfigFor(schedule));

        request.subscribe(
            response => {
                this.scheduleListUpdated.next(response);
            }, error => {
                this.handleErrors(error);
            }
        );
    }

    private handleErrors(errors) {
        let errorMessage = this.getUpdateErrorMessage(errors);
        this.notificationService.showErrorNotificationBar(errorMessage);
        if (errors.status === 409) {
            this.scheduleListUpdated.next(errors.body);
        }
    }

    private requestConfigFor(schedule: Schedule) {
        let requestSettings: RequestConfig = {spinner: {name: SpinnerNameUtils.getName(schedule, "schedules")}};

        return requestSettings
    }

    removeSchedule(schedule: Schedule) {
        this.apiService.delete(`${SCHEDULES_API}/${schedule.id}`).subscribe(
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
