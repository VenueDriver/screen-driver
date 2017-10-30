/* tslint:disable:no-unused-variable */


import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {KioskVersionService} from "../kiosk-version.service";
import {async, inject, TestBed} from "@angular/core/testing";
import {KioskVersionServiceFixture} from "./kiosk-version-service.fixture";
import {KioskVersionDetailsMap} from "../entities/kiosk-version-details";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";

fdescribe('Service: KioskVersionService', () => {
    let kioskVersionService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                KioskVersionService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([KioskVersionService, ConnectionBackend], (kioskVersionService) => {
        this.kioskVersionService = kioskVersionService;
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
            const secondVersion = kioskVersions[0];

            expect(map[firstVersion.screenId]).toBe(firstVersion);
            expect(map[secondVersion.screenId]).toBe(secondVersion);
        });
    });

    describe('loadKioskVersions()', () => {

        it(`should expect a GET /foo/bar`, async(inject([HttpClient, HttpTestingController],
            (http: HttpClient, backend: HttpTestingController) => {
                const kioskVersions = KioskVersionServiceFixture.kioskVersions(2);

                this.kioskVersionService.loadKioskVersions().subscribe((kioskVersionDetailsMap: KioskVersionDetailsMap) => {
                    const firstVersion = kioskVersions[0];
                    const secondVersion = kioskVersions[0];

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
