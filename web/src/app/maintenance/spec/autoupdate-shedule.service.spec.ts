/* tslint:disable:no-unused-variable */


import 'rxjs/add/operator/map';
import {async, inject, TestBed} from "@angular/core/testing";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule, HttpRequest} from "@angular/common/http";
import {AutoupdateScheduleService} from "../autoupdate-schedule.service";
import {AutoupdateScheduleServiceFixture} from "./fixtures/autoupdate-schedule-service.fixture";
import {AutoupdateSchedule} from "../entities/autoupdate-schedule";
import {ApiService} from "../../shared/services/api.service";
import {SpinnerService} from "../../shared/spinner/spinner.service";
import {DataLoadingMonitorService} from "../../shared/services/data-loading-monitor/data-loading-monitor.service";

describe('Service: AutoupdateScheduleService', () => {
    let autoupdateScheduleService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                AutoupdateScheduleService,
                ApiService,
                SpinnerService,
                DataLoadingMonitorService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([AutoupdateScheduleService, ApiService, SpinnerService, DataLoadingMonitorService, ConnectionBackend],
        (autoupdateScheduleService, apiService, spinnerService, dataLoadingMonitorService) => {
        this.autoupdateScheduleService = autoupdateScheduleService;
        this.apiService = apiService;
        this.spinnerService = spinnerService;
        this.dataLoadingMonitorService = dataLoadingMonitorService;
    }));

    describe('apiPath', () => {
        it('should be "/api/screens/versions"', () => {
            expect(this.autoupdateScheduleService.apiPath).toContain('/api/screens/update-schedule')
        });
    });

    describe('createSchedulesMap()', () => {
        it('should convert versions and return schedules map where map key is schedule id (eql to venue id)', () => {
            const schedules = AutoupdateScheduleServiceFixture.schedules(2);
            const map: any = this.autoupdateScheduleService.createSchedulesMap(schedules);

            const firstVersion = schedules[0];
            const secondVersion = schedules[1];

            expect(map[firstVersion.id]).toBe(firstVersion);
            expect(map[secondVersion.id]).toBe(secondVersion);
        });
    });

    describe('createDefaultAutoapdateSchedule()', () => {
        it('should create schedule with cron 0 0 1 * * * *', () => {
            const schedule = this.autoupdateScheduleService.createDefaultAutoapdateSchedule();
            expect(schedule.eventTime).toBe('0 0 1 * * * *');
        });
    });

    describe('upsert()', () => {

        it('should send UPDATE request and return updated schedule', async(inject([HttpClient, HttpTestingController],
            (http: HttpClient, backend: HttpTestingController) => {
                const schedule: AutoupdateSchedule = AutoupdateScheduleServiceFixture.schedules(1)[0];

                this.autoupdateScheduleService.upsert(schedule)
                    .subscribe((updatedSchedule: AutoupdateSchedule) => expect(updatedSchedule).toBe(schedule));

                backend.expectOne((req: HttpRequest<any>) => {
                    const isRequestBodySchedule = () => req.body instanceof AutoupdateSchedule;
                    const checkForScheduleParams = () => req.body.id == schedule.id && req.body.eventTime == schedule.eventTime;
                    return req.url === '/api/screens/update-schedule' && req.method === 'PUT' && isRequestBodySchedule() && checkForScheduleParams();
                }, `PUT to '/api/screens/update-schedule' with schedule object`).flush(schedule);

            })));
    });

    describe('loadAutoupdateSchedule()', () => {

        it('should send GET request to /api/screens/update-schedule and return fetched schedules', async(inject([HttpClient, HttpTestingController],
            (http: HttpClient, backend: HttpTestingController) => {
                const schedules: AutoupdateSchedule[] = AutoupdateScheduleServiceFixture.schedules(3);

                this.autoupdateScheduleService.loadAutoupdateSchedule()
                    .subscribe((schedules: AutoupdateSchedule[]) => expect(schedules.length).toBe(3));

                backend.match({
                    url: '/api/screens/update-schedule',
                    method: 'GET'
                })[0].flush(schedules)

            })));
    });
});
