/* tslint:disable:no-unused-variable */


import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {inject, TestBed} from "@angular/core/testing";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {AutoupdateScheduleService} from "../autoupdate-schedule.service";
import {AutoupdateScheduleServiceFixture} from "./fixtures/autoupdate-schedule-service.fixture";
import {AutoupdateSchedule} from "../entities/autoupdate-schedule";
import {VenuesService} from "../../content-management/venues/venues.service";
import {KioskVersionService} from "../kiosk-version.service";
import {MaintenanceService} from "../maintenance.service";
import {MaintenanceProperties} from "../entities/maintenance-properties";
import {ContentService} from "../../content/content.service";
import {MaintenanceFixture} from "./fixtures/maintenance.fixture";
import {AutoUpdateScheduleFixture} from "../entities/spec/auto-update-schedule.fixture";
import {KioskVersionServiceFixture} from "./fixtures/kiosk-version-service.fixture";
import {VenueMaintenanceInfo} from "../entities/venue-maintenance-info";
import {ApiService} from "../../shared/services/api.service";
import {SpinnerService} from "../../shared/spinner/spinner.service";
import {DataLoadingMonitorService} from "../../shared/services/data-loading-monitor/data-loading-monitor.service";

describe('Service: MaintenanceService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                ContentService,
                VenuesService,
                KioskVersionService,
                AutoupdateScheduleService,
                MaintenanceService,
                ApiService,
                SpinnerService,
                DataLoadingMonitorService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([MaintenanceService, VenuesService, AutoupdateScheduleService, KioskVersionService, ApiService, SpinnerService, DataLoadingMonitorService],
        (maintenanceService, venuesService, autoupdateScheduleService, kioskVersionsService, apiService, spinnerService, dataLoadingMonitorService) => {
        this.maintenanceService = maintenanceService;
        this.venuesService = venuesService;
        this.autoupdateScheduleService = autoupdateScheduleService;
        this.kioskVersionsService = kioskVersionsService;
        this.apiService = apiService;
        this.spinnerService = spinnerService;
        this.dataLoadingMonitorService = dataLoadingMonitorService;
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

    describe('loadVenues()', () => {

        afterAll(() => {
            this.venuesService.loadVenues.and.callThrough();
        });

        it('should trigger venuesService.loadVenues()', () => {
            spyOn(this.venuesService, 'loadVenues').and.returnValue(Observable.of([]));

            this.maintenanceService.loadVenues()
                .subscribe(() => expect(this.venuesService.loadVenues).toHaveBeenCalled());

        });
    });

    describe('loadAutoupdateSchedules()', () => {

        afterAll(() => {
            this.autoupdateScheduleService.loadAutoupdateSchedule.and.callThrough();
        });

        it('should trigger autoupdateScheduleService.loadAutoupdateSchedule()', () => {
            spyOn(this.autoupdateScheduleService, 'loadAutoupdateSchedule').and.returnValue(Observable.of([]));

            this.maintenanceService.loadAutoupdateSchedules()
                .subscribe(() => expect(this.autoupdateScheduleService.loadAutoupdateSchedule).toHaveBeenCalled());
        });
    });

    describe('loadKioskVersions()', () => {

        afterAll(() => {
            this.kioskVersionsService.loadKioskVersions.and.callThrough();
        });

        it('should trigger kioskVersionsService.loadKioskVersions()', () => {
            spyOn(this.kioskVersionsService, 'loadKioskVersions').and.returnValue(Observable.of([]));

            this.maintenanceService.loadAutoupdateSchedules()
                .subscribe(() => expect(this.kioskVersionsService.loadKioskVersions).toHaveBeenCalled());
        });
    });

    describe('mergeVenueWithSchedule()', () => {
        it('should merge schedule config into the related venue', () => {
            const venues: Array<VenueMaintenanceInfo> = MaintenanceFixture.venueMaintenanceInfo(2);
            const schedules: Array<AutoupdateSchedule> = AutoupdateScheduleServiceFixture.schedules(2);

            const mergedVenues: Array<VenueMaintenanceInfo> = this.maintenanceService.mergeVenueWithSchedule(venues, schedules);

            expect(mergedVenues[0].autoupdateSchedule).toBe(schedules[0]);
            expect(mergedVenues[1].autoupdateSchedule).toBe(schedules[1]);
        });

        describe('when there is not config for venue', () => {
            it('should generate default config', () => {
                const venues: Array<VenueMaintenanceInfo> = MaintenanceFixture.venueMaintenanceInfo(3);
                const schedules: Array<AutoupdateSchedule> = AutoupdateScheduleServiceFixture.schedules(2);
                const defaultSchedule = Object.assign(this.autoupdateScheduleService.createDefaultAutoapdateSchedule(), {id: venues[2].id});

                const mergedVenues: Array<VenueMaintenanceInfo> = this.maintenanceService.mergeVenueWithSchedule(venues, schedules);

                expect(mergedVenues[0].autoupdateSchedule).toBe(schedules[0]);
                expect(mergedVenues[1].autoupdateSchedule).toBe(schedules[1]);
                expect(mergedVenues[2].autoupdateSchedule).toEqual(jasmine.objectContaining(defaultSchedule));
            });
        });
    });

    describe('updateVenueSchedule()', () => {

        afterAll(() => {
            this.venuesService.autoupdateScheduleService.and.callThrough();
        });

        it('should trigger venuesService.loadVenues()', () => {
            const schedule = AutoUpdateScheduleFixture.schedule();

            spyOn(this.autoupdateScheduleService, 'upsert').and.returnValue(Observable.of(schedule));

            this.maintenanceService.updateVenueSchedule(schedule)
                .subscribe(() => expect(this.autoupdateScheduleService.upsert).toHaveBeenCalledWith(schedule));

        });
    });
});
