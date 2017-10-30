/* tslint:disable:no-unused-variable */


import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {async, inject, TestBed} from "@angular/core/testing";
import {KioskVersionServiceFixture} from "./kiosk-version-service.fixture";
import {KioskVersionDetailsMap} from "../entities/kiosk-version-details";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AutoupdateScheduleService} from "../autoupdate-schedule.service";
import {AutoupdateScheduleServiceFixture} from "./autoupdate-schedule-service.fixture";

fdescribe('Service: AutoupdateScheduleService', () => {
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

    describe('createSchedulesMap', () => {
        it('should convert versions and return to schedules map where map key is venue (schedule id)', () => {
            const schedules = AutoupdateScheduleServiceFixture.schedules(2);
            const map: any = this.autoupdateScheduleService.createSchedulesMap(schedules);

            const firstVersion = schedules[0];
            const secondVersion = schedules[0];

            expect(map[firstVersion.id]).toBe(firstVersion);
            expect(map[secondVersion.id]).toBe(secondVersion);
        });
    });
});
