/* tslint:disable:no-unused-variable */


import 'rxjs/add/operator/map';
import {KioskVersionService} from "../kiosk-version.service";
import {async, inject, TestBed} from "@angular/core/testing";
import {KioskVersionServiceFixture} from "./fixtures/kiosk-version-service.fixture";
import {KioskVersionDetailsMap} from "../entities/kiosk-version-details";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "../../shared/services/api.service";
import {DataLoadingMonitorService} from "../../shared/services/data-loading-monitor/data-loading-monitor.service";
import {SpinnerService} from "../../shared/spinner/spinner.service";

describe('Service: KioskVersionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                KioskVersionService,
                ApiService,
                SpinnerService,
                DataLoadingMonitorService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([KioskVersionService, ApiService, SpinnerService, DataLoadingMonitorService, ConnectionBackend],
        (kioskVersionService, apiService, spinnerService, dataLoadingMonitorService) => {
        this.kioskVersionService = kioskVersionService;
        this.apiService = apiService;
        this.spinnerService = spinnerService;
        this.dataLoadingMonitorService = dataLoadingMonitorService;
    }));

    describe('apiPath', () => {
        it('should be "/api/screens/versions"', () => {
            expect(this.kioskVersionService.apiPath).toContain('/api/screens/versions')
        });
    });

    describe('createKioskVersionsMap', () => {
        it('should convert versions and return KioskVersionDetailsMap', () => {
            const kioskVersions = KioskVersionServiceFixture.kioskVersions(2);
            const map: KioskVersionDetailsMap = this.kioskVersionService.createKioskVersionsMap(kioskVersions);

            const firstVersion = kioskVersions[0];
            const secondVersion = kioskVersions[1];

            expect(map[firstVersion.screenId]).toBe(firstVersion);
            expect(map[secondVersion.screenId]).toBe(secondVersion);
        });
    });

    describe('loadKioskVersions()', () => {

        it('should loader kiosk versions as KioskVersionDetailsMap', async(inject([ApiService, HttpTestingController],
            (http: ApiService, backend: HttpTestingController) => {
                const kioskVersions = KioskVersionServiceFixture.kioskVersions(2);

                this.kioskVersionService.loadKioskVersions().subscribe((kioskVersionDetailsMap: KioskVersionDetailsMap) => {
                    const firstVersion = kioskVersions[0];
                    const secondVersion = kioskVersions[1];

                    expect(kioskVersionDetailsMap[firstVersion.screenId]).toBe(firstVersion);
                    expect(kioskVersionDetailsMap[secondVersion.screenId]).toBe(secondVersion);
                });

                backend.match({
                    url: '/api/screens/versions',
                    method: 'GET'
                })[0].flush(kioskVersions);
            })));
    });
});
