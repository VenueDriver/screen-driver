import {async, inject, TestBed} from "@angular/core/testing";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {NotificationService} from "../../../shared/notifications/notification.service";
import {ApiService} from "../../../shared/services/api.service";
import {SettingStateHolderService} from "../../../core/setting-state-manager/settings-state-holder.service";
import {SettingsService} from "../../../settings/settings.service";
import {NotificationsService} from "angular2-notifications";
import {SchedulesService} from "../schedules.service";
import {SpinnerService} from "../../../shared/spinner/spinner.service";
import {DataLoadingMonitorService} from "../../../shared/services/data-loading-monitor/data-loading-monitor.service";
import {Schedule} from "../models/schedule.model";
import {SchedulesFixture} from "./fixtures/schedules.fixture";
import {SettingsFixture} from "./fixtures/settings.fixture";
import {getPropertyName, Periodicity} from "../../../core/enums/periodicity";
import {EventTimeHolderFixture} from "./fixtures/event-time-holder.fixture";
import {Observable} from "rxjs";

fdescribe('Service: SchedulesService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                ApiService,
                SchedulesService,
                SpinnerService,
                DataLoadingMonitorService,
                SettingsService,
                SettingStateHolderService,
                NotificationService,
                NotificationsService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([SchedulesService, ApiService, SettingsService, SettingStateHolderService, NotificationService, NotificationsService],
        (schedulesService, apiService, settingsService, settingStateHolderService, notificationService, notificationsService) => {
            this.schedulesService = schedulesService;
            this.apiService = apiService;
            this.settingsService = settingsService;
            this.settingStateHolderService = settingStateHolderService;
            this.notificationService = notificationService;
            this.notificationsService = notificationsService;
    }));

    describe('loadSchedules()', () => {

        it('should load schedules', async(inject([ApiService, HttpTestingController],
            (http: ApiService, backend: HttpTestingController) => {
                const schedules: Array<Schedule> = SchedulesFixture.getSchedulesInfo(3);

                this.schedulesService.loadSchedules().subscribe((response: Array<Schedule>) => {
                    expect(response.length).toBe(3);
                    expect(response[0]).toBe(schedules[0]);
                    expect(response[1]).toBe(schedules[1]);
                    expect(response[2]).toBe(schedules[2]);
                });

                backend.match({
                    url: '/api/schedules',
                    method: 'GET'
                })[0].flush(schedules);
        })));

    });

    describe('createSchedule()', () => {

        describe('when called with undefined setting and eventTimeHolder', () => {
            it('save method should be called', () => {
                const eventTimeHolder = EventTimeHolderFixture.getEventTimeHolderInstance();
                const expectedSchedule = SchedulesFixture.getOneTimeSchedule();

                spyOn(this.schedulesService, 'save');

                this.schedulesService.createSchedule(undefined, eventTimeHolder);

                expect(this.schedulesService.save).toHaveBeenCalledWith(expectedSchedule);
            });
        });

        describe('when called with setting and eventTimeHolder', () => {
            it('save method should be called with schedule contained setting id', () => {
                const setting = SettingsFixture.getSettingWithId();
                const eventTimeHolder = EventTimeHolderFixture.getEventTimeHolderInstance();
                const expectedSchedule = SchedulesFixture.getOneTimeSchedule();
                expectedSchedule.settingId = setting.id;

                spyOn(this.schedulesService, 'save');

                this.schedulesService.createSchedule(setting, eventTimeHolder);

                expect(this.schedulesService.save).toHaveBeenCalledWith(expectedSchedule);
            });

            it('save method should be called with schedule which periodicity that is equal to the one of event time holder', () => {
                const setting = SettingsFixture.getSettingWithId();
                const eventTimeHolder = EventTimeHolderFixture.getEventTimeHolderInstance();
                eventTimeHolder.setPeriodicity(Periodicity.REPEATABLE);

                const expectedSchedule = SchedulesFixture.getRepeatableSchedule();
                expectedSchedule.settingId = setting.id;
                expectedSchedule.periodicity = getPropertyName(Periodicity.REPEATABLE);

                spyOn(this.schedulesService, 'save');

                this.schedulesService.createSchedule(setting, eventTimeHolder);

                expect(this.schedulesService.save).toHaveBeenCalledWith(expectedSchedule);
            });

            it('save method should be called with schedule which cron expressions that are equal to the ones generated by event time holder', () => {
                const setting = SettingsFixture.getSettingWithId();
                const eventTimeHolder = EventTimeHolderFixture.getEventTimeHolderInstance();
                eventTimeHolder.setStartTime('9:50');
                eventTimeHolder.value().startTimePeriod = 'PM';
                eventTimeHolder.setEndTime('11:00');
                eventTimeHolder.value().endTimePeriod = 'PM';

                const expectedSchedule = SchedulesFixture.getOneTimeSchedule();
                expectedSchedule.eventCron = '0 50 21 1 JAN * 2017';
                expectedSchedule.endEventCron = '0 0 23 1 JAN * 2017';
                expectedSchedule.settingId = setting.id;

                spyOn(this.schedulesService, 'save');

                this.schedulesService.createSchedule(setting, eventTimeHolder);

                expect(this.schedulesService.save).toHaveBeenCalledWith(expectedSchedule);
            });
        });

    });

    describe('save()', () => {

        describe('when called', () => {
            it('should call POST /api/schedules', () => {
                const schedule = SchedulesFixture.getOneTimeSchedule();
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(schedule));

                this.schedulesService.save(schedule);

                expect(this.apiService.post).toHaveBeenCalledWith('/api/schedules', schedule, {spinner: {name: 'spinner'}});
            });
        });

        describe('when response with success status received', () => {
           it('should call handleResponseWithSchedule method', () => {
               const schedule = SchedulesFixture.getOneTimeSchedule();
               spyOn(this.apiService, 'post').and.returnValue(Observable.of(schedule));
               spyOn(this.schedulesService, 'handleResponseWithSchedule');

               this.schedulesService.save(schedule);

               expect(this.schedulesService.handleResponseWithSchedule).toHaveBeenCalledWith(schedule);
           });
        });

        describe('when response with error status received', () => {
            it('should call showErrorNotificationBar method with error message', () => {
                const schedule = SchedulesFixture.getOneTimeSchedule();
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 403}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.schedulesService.save(schedule);

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Unable to perform the create schedule operation');
            });
        });

        describe('when response with 409 status received', () => {
            it('should call showErrorNotificationBar method with error message', () => {
                const schedule = SchedulesFixture.getOneTimeSchedule();
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 409}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.schedulesService.save(schedule);

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Conflict between schedules has been detected. Schedule saved as disabled now');
            });

            it('should call handleResponseWithSchedule method with error message', () => {
                const schedule = SchedulesFixture.getOneTimeSchedule();
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 409, _body: schedule}));
                spyOn(this.schedulesService, 'handleResponseWithSchedule');

                this.schedulesService.save(schedule);

                expect(this.schedulesService.handleResponseWithSchedule).toHaveBeenCalledWith(schedule);
            });
        });

    });

    describe('updateSchedule()', () => {

        describe('when called with schedule', () => {

            const schedule = SchedulesFixture.getOneTimeSchedule('scheduleID');

            it('should call PUT /api/schedules/{id} with spinner config', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(schedule));

                this.schedulesService.updateSchedule(schedule);

                expect(this.apiService.put).toHaveBeenCalledWith('/api/schedules/scheduleID', schedule, {spinner: {name: 'schedules-spinner-scheduleID'}});
            });

            it('should call handleResponseWithSchedule method', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(schedule));
                spyOn(this.schedulesService, 'handleResponseWithSchedule');

                this.schedulesService.updateSchedule(schedule);

                expect(this.schedulesService.handleResponseWithSchedule).toHaveBeenCalledWith(schedule);
            });
        });

        describe('when response with error status received', () => {
            it('should call showErrorNotificationBar method with error message', () => {
                const schedule = SchedulesFixture.getOneTimeSchedule();
                schedule.id = 'scheduleID';
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 403}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.schedulesService.updateSchedule(schedule);

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Unable to perform the update schedule operation');
            });
        });

        describe('when response with 409 status received', () => {

            const schedule = SchedulesFixture.getOneTimeSchedule('scheduleID');

            it('should call showErrorNotificationBar method with error message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 409}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.schedulesService.updateSchedule(schedule);

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Conflict between schedules has been detected. Schedule is disabled now');
            });

            it('should call handleResponseWithSchedule method with error message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 409, body: schedule}));
                spyOn(this.schedulesService, 'handleResponseWithSchedule');

                this.schedulesService.updateSchedule(schedule);

                expect(this.schedulesService.handleResponseWithSchedule).toHaveBeenCalledWith(schedule);
            });
        });

        describe('when called with schedule and eventTimeHolder', () => {

            it('schedule with periodicity that is equal to the one of event time holder should be sent to the ApiService', () => {
                const eventTimeHolder = EventTimeHolderFixture.getEventTimeHolderInstance();
                eventTimeHolder.setPeriodicity(Periodicity.REPEATABLE);

                const schedule = SchedulesFixture.getRepeatableSchedule('scheduleID');

                spyOn(this.apiService, 'put').and.returnValue(Observable.of(schedule));

                this.schedulesService.updateSchedule(SchedulesFixture.getRepeatableSchedule('scheduleID'), eventTimeHolder);
                expect(this.apiService.put).toHaveBeenCalledWith('/api/schedules/scheduleID', schedule, {spinner: {name: 'schedules-spinner-scheduleID'}});
            });

            it('schedule which cron expressions that are equal to the ones generated by event time holder should be sent to the ApiService', () => {
                const eventTimeHolder = EventTimeHolderFixture.getEventTimeHolderInstance();
                eventTimeHolder.setStartTime('9:50');
                eventTimeHolder.value().startTimePeriod = 'PM';
                eventTimeHolder.setEndTime('11:00');
                eventTimeHolder.value().endTimePeriod = 'PM';

                const expectedSchedule = SchedulesFixture.getOneTimeSchedule('scheduleID');
                expectedSchedule.eventCron = '0 50 21 1 JAN * 2017';
                expectedSchedule.endEventCron = '0 0 23 1 JAN * 2017';

                spyOn(this.apiService, 'put').and.returnValue(Observable.of(expectedSchedule));

                this.schedulesService.updateSchedule(SchedulesFixture.getOneTimeSchedule('scheduleID'), eventTimeHolder);

                expect(this.apiService.put).toHaveBeenCalledWith('/api/schedules/scheduleID', expectedSchedule, {spinner: {name: 'schedules-spinner-scheduleID'}});
            });
        });

    });

});
