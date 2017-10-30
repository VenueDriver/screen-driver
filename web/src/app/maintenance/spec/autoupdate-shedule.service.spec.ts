/* tslint:disable:no-unused-variable */


import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {async, inject, TestBed} from "@angular/core/testing";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule, HttpParams, HttpRequest} from "@angular/common/http";
import {AutoupdateScheduleService} from "../autoupdate-schedule.service";
import {AutoupdateScheduleServiceFixture} from "./autoupdate-schedule-service.fixture";
import {AutoupdateSchedule} from "../entities/autoupdate-schedule";

describe('Service: AutoupdateScheduleService', () => {
    let autoupdateScheduleService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                AutoupdateScheduleService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([AutoupdateScheduleService, ConnectionBackend], (autoupdateScheduleService) => {
        this.autoupdateScheduleService = autoupdateScheduleService;
    }));

    describe('apiPath', () => {
        it('should be "/api/screens/versions"', () => {
            expect(this.autoupdateScheduleService.apiPath).toContain('/api/screens/update-schedule')
        });
    });

    describe('createSchedulesMap()', () => {
        it('should convert versions and return to schedules map where map key is venue (schedule id)', () => {
            const schedules = AutoupdateScheduleServiceFixture.schedules(2);
            const map: any = this.autoupdateScheduleService.createSchedulesMap(schedules);

            const firstVersion = schedules[0];
            const secondVersion = schedules[0];

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
