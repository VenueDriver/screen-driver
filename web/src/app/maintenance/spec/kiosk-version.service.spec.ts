/* tslint:disable:no-unused-variable */


import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {BaseRequestOptions, ConnectionBackend, RequestOptions} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {KioskVersionService} from "../kiosk-version.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {inject, TestBed} from "@angular/core/testing";
import {KioskVersionServiceFixture} from "./kiosk-version-service.fixture";
import {KioskVersionDetailsMap} from "../entities/kiosk-version-details";

fdescribe('Service: KioskVersionService', () => {
    let kioskVersionService;
    let backend;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                KioskVersionService,
                {provide: ConnectionBackend, useClass: MockBackend},
                {provide: RequestOptions, useClass: BaseRequestOptions},
            ]
        });
    });

    beforeEach(inject([KioskVersionService, ConnectionBackend], (kioskVersionService, connectionBackend) => {
        this.kioskVersionService = kioskVersionService;
        this.backend = connectionBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
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
});
