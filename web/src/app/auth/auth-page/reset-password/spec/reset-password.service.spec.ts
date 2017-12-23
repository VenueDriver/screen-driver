import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ResetPasswordService} from "../reset-password.service";
import {ApiService} from "../../../../shared/services/api.service";
import {SpinnerService} from "../../../../shared/spinner/spinner.service";
import {DataLoadingMonitorService} from "../../../../shared/services/data-loading-monitor/data-loading-monitor.service";
import {Observable} from "rxjs/Observable";

describe('Service: ResetPasswordService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
            ],
            providers: [
                ResetPasswordService,
                ApiService,
                SpinnerService,
                HttpClient,
                DataLoadingMonitorService,
            ]
        });

        this.resetPasswordService = TestBed.get(ResetPasswordService);
        this.apiService = TestBed.get(ApiService);
    });

    describe('sendResetPasswordRequest()', () => {

        describe('when called with email', () => {
            const email = {email: 'user@example.com'};

            it('should call POST /api/auth/profile/password/reset with email', () => {
                spyOn(this.apiService, 'post');

                this.resetPasswordService.sendResetPasswordRequest(email);

                expect(this.apiService.post).toHaveBeenCalledWith('/api/auth/profile/password/reset', email);
            });

            it('should return observable with response', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({status: 200}));

                this.resetPasswordService.sendResetPasswordRequest(email).subscribe((response) => {
                    expect(response).toEqual({status: 200});
                });
            });

        });

    });

    describe('sendResetPasswordConfirmation()', () => {

        describe('when called with {userId: \'userId\', verificationCode: \'code\', password: \'password\'}', () => {
            const resetConfirmationRequest = {userId: 'userId', verificationCode: 'code', password: 'password'};

            it('should call POST /api/auth/profile/password/reset/confirm with {userId: \'userId\', verificationCode: \'code\', password: \'password\'}', () => {
                spyOn(this.apiService, 'post');

                this.resetPasswordService.sendResetPasswordConfirmation(resetConfirmationRequest);

                expect(this.apiService.post)
                    .toHaveBeenCalledWith('/api/auth/profile/password/reset/confirm', resetConfirmationRequest);
            });

            it('should return observable with response', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({status: 200}));

                this.resetPasswordService.sendResetPasswordConfirmation(resetConfirmationRequest).subscribe((response) => {
                    expect(response).toEqual({status: 200});
                });
            });
        });

    });


});
