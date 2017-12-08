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

        it('should return observable with created setting', () => {
            const setting = SettingsFixture.getSetting();
            spyOn(this.apiService, 'post').and.returnValue(Observable.of(setting));

            this.settingsService.createSetting(setting).subscribe(response => {
                expect(response).toEqual(setting);
            });
        });
    });

    describe('updateSetting()', () => {

        const setting = SettingsFixture.getSetting('settingId');

        describe('when called with setting', () => {
            it('should call put method with /api/settings/settingId and setting instance', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(setting));

                this.settingsService.updateSetting(setting);

                expect(this.apiService.put).toHaveBeenCalledWith('/api/settings/settingId', setting);
            });

            it('should call showSuccessNotificationBar method with \'Setting was updated successfully\' message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(setting));
                spyOn(this.notificationService, 'showSuccessNotificationBar');

                this.settingsService.updateSetting(setting);

                expect(this.notificationService.showSuccessNotificationBar).toHaveBeenCalledWith('Setting was updated successfully');
            });

            it('should return observable with setting instance', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(setting));

                this.settingsService.updateSetting(setting).subscribe(receivedSetting => {
                    expect(receivedSetting).toEqual(setting)
                });
            });
        });

        describe('when called with setting and successMessage', () => {
            it('should call showSuccessNotificationBar method with received message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.of(setting));
                spyOn(this.notificationService, 'showSuccessNotificationBar');

                this.settingsService.updateSetting(setting, 'Update was successful');

                expect(this.notificationService.showSuccessNotificationBar).toHaveBeenCalledWith('Update was successful');
            });
        });

        describe('when called with setting and the server respond with an error', () => {
            it('should call showErrorNotificationBar method with \'Unable to update setting\' message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 403}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.settingsService.updateSetting(setting);

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Unable to update setting');
            });

            it('should return observable with error', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 403, error: 'Error'}));

                this.settingsService.updateSetting(setting).subscribe(
                    () => {},
                    (error) => {
                        expect(error).toEqual({status: 403, error: 'Error'})
                    }
                );
            });
        });

        describe('when called with setting and the server respond with a conflict error', () => {
            it('should call showErrorNotificationBar method with \'Conflict between settings has been detected. Setting is disabled now\' message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 409}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.settingsService.updateSetting(setting);

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Conflict between settings has been detected. Setting is disabled now');
            });
        });

        describe('when called with setting, successMessage and errorMessage, and the server respond with an error', () => {
            it('should call showErrorNotificationBar method with received error message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 403}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.settingsService.updateSetting(setting, 'Update was successful', 'Update was unsuccessful');

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Update was unsuccessful');
            });
        });

        describe('when called with setting, successMessage and errorMessage, and the server respond with a conflict error', () => {
            it('should call showErrorNotificationBar method with \'Conflict between settings has been detected. Setting is disabled now\' message', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 409}));
                spyOn(this.notificationService, 'showErrorNotificationBar');

                this.settingsService.updateSetting(setting, 'Update was successful', 'Update was unsuccessful');

                expect(this.notificationService.showErrorNotificationBar).toHaveBeenCalledWith('Conflict between settings has been detected. Setting is disabled now');
            });
        });

    });

    describe('removeSetting()', () => {

       describe('when called with settingId', () => {
          it('should call delete method with /api/settings/settingId', () => {
              spyOn(this.apiService, 'delete').and.returnValue(Observable.of({}));

              this.settingsService.removeSetting('settingId');

              expect(this.apiService.delete).toHaveBeenCalledWith('/api/settings/settingId');
          });

           it('should return observable with response', () => {
               spyOn(this.apiService, 'delete').and.returnValue(Observable.of({status: 200}));

               this.settingsService.removeSetting('settingId').subscribe(response => {
                   expect(response).toEqual({status: 200});
               });
           });
       });

    });
});
