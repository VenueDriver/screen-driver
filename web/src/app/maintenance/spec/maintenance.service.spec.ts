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
import {VenuesService} from "../../content-management/venues/venues.service";
import {KioskVersionService} from "../kiosk-version.service";
import {MaintenanceService} from "../maintenance.service";
import {MaintenanceProperties} from "../entities/maintenance-properties";
import {ContentService} from "../../content/content.service";
import {MaintenanceFixture} from "./maintenance.fixture";
import {AutoUpdateScheduleFixture} from "../entities/spec/auto-update-schedule.fixture";
import {KioskVersionServiceFixture} from "./kiosk-version-service.fixture";

describe('Service: AutoupdateScheduleService', () => {
    let maintenanceService: MaintenanceService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                ContentService,
                VenuesService,
                KioskVersionService,
                AutoupdateScheduleService,
                MaintenanceService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([MaintenanceService, ConnectionBackend], (maintenanceService) => {
        this.maintenanceService = maintenanceService;
    }));

    describe('loadData()', () => {

        afterAll(() => {
            this.maintenanceService.loadVenues.and.callThrough();
            this.maintenanceService.loadAutoupdateSchedules.and.callThrough();
            this.maintenanceService.loadKioskVersions.and.callThrough();
        });

        it('should load data as MaintenanceProperties', () => {
            let venues = MaintenanceFixture.venueMaintenanceInfo(1);
            let autoUpdates = AutoupdateScheduleServiceFixture.schedules(1);
            let kioskVersions = KioskVersionServiceFixture.kioskVersions(1);

            spyOn(this.maintenanceService, 'loadVenues').and.returnValue(Observable.of(venues));
            spyOn(this.maintenanceService, 'loadAutoupdateSchedules').and.returnValue(Observable.of(autoUpdates));
            spyOn(this.maintenanceService, 'loadKioskVersions').and.returnValue(Observable.of(kioskVersions));

            this.maintenanceService.loadData()
                .subscribe((properties: MaintenanceProperties) => {
                    expect(properties.venues.length).toBe(1);
                    expect(properties.autoupdateSchedules.length).toBe(1);
                    expect(properties.kioskVersions.length).toBe(1);
                });
        });
    });
});
