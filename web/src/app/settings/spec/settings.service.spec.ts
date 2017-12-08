import {async, inject, TestBed} from "@angular/core/testing";
import {
    BaseRequestOptions, ConnectionBackend, RequestOptions
} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {NotificationService} from "../../shared/notifications/notification.service";
import {ApiService} from "../../shared/services/api.service";
import {SettingsService} from "../settings.service";
import {NotificationsService} from "angular2-notifications";
import {SettingsFixture} from "./fixtures/settings.fixture";
import {Setting} from "../entities/setting";
import {SpinnerService} from "../../shared/spinner/spinner.service";
import {DataLoadingMonitorService} from "../../shared/services/data-loading-monitor/data-loading-monitor.service";
import {Observable} from "rxjs";

describe('Service: SettingsService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                ApiService,
                SettingsService,
                NotificationService,
                NotificationsService,
                SpinnerService,
                DataLoadingMonitorService
            ]
        });

        this.settingsService = TestBed.get(SettingsService);
        this.apiService = TestBed.get(ApiService);
        this.notificationService = TestBed.get(NotificationService);
    });

    describe('loadSettings()', () => {
        it('should load schedules', async(inject([HttpTestingController],
            (backend: HttpTestingController) => {
                const settings = SettingsFixture.getSettings(2);

                this.settingsService.loadSettings().subscribe((response: Array<Setting>) => {
                    expect(response.length).toBe(2);
                    expect(response[0]).toBe(settings[0]);
                    expect(response[1]).toBe(settings[1]);
                });

                backend.match({
                    url: '/api/settings',
                    method: 'GET'
                })[0].flush(settings);
        })));
    });

    describe('createSetting()', () => {
        it('should call post method with /api/settings and setting instance', () => {
           const setting = SettingsFixture.getSetting();
           spyOn(this.apiService, 'post');

           this.settingsService.createSetting(setting);

           expect(this.apiService.post).toHaveBeenCalledWith('/api/settings', setting);
        });
    });

    describe('updateSetting()', () => {

        describe('when called with setting', () => {

            const setting = SettingsFixture.getSetting('settingId');

            it('should call put method with /api/settings/settingId and setting instance', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(setting));

                this.settingsService.updateSetting(setting);

                expect(this.apiService.put).toHaveBeenCalledWith('/api/settings/settingId', setting);
            });

            it('should call showSuccessNotificationBar with \'Setting was updated successfully\' message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(setting));
                spyOn(this.notificationService, 'showSuccessNotificationBar');

                this.settingsService.updateSetting(setting);

                expect(this.notificationService.showSuccessNotificationBar).toHaveBeenCalledWith('Setting was updated successfully');
            });

            it('should return observable with setting instance', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(setting));

                this.settingsService.updateSetting(setting).subscribe(receiveSetting => {
                    expect(receiveSetting).toEqual(setting)
                });
            });
        });

    });
});
