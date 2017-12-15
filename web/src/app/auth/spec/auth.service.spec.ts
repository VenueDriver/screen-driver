
import {TestBed} from "@angular/core/testing";
import {ApiService} from "../../shared/services/api.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from '@angular/router/testing';
import {AuthTokenService} from "../auth-token.service";
import {SpinnerService} from "../../shared/spinner/spinner.service";
import {DataLoadingMonitorService} from "../../shared/services/data-loading-monitor/data-loading-monitor.service";
import {AuthService} from "../auth.service";
import {Observable} from "rxjs/Observable";

/*
    Payload of the token contains the following claims:
    {
        "iss": "Online JWT Builder",
        "iat": 1512086400,
        "exp": 1512086460,
        "aud": "www.example.com",
        "sub": "userId",
        "email": "user@example.com",
        "userId": "userId",
        "isAdmin": "true"
    }
 */
const ID_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MTIwODY0MDAsImV4cCI6MTUxMjA4NjQ2MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoidXNlcklkIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwidXNlcklkIjoidXNlcklkIiwiaXNBZG1pbiI6InRydWUifQ.eaeyabNc5hxAEkMNip4KeUTcw0T2zQT4w81p3FUJQgk';

fdescribe('Service: AuthService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                ApiService,
                AuthService,
                AuthTokenService,
                HttpClient,
                SpinnerService,
                DataLoadingMonitorService,
            ]
        });

        this.authService = TestBed.get(AuthService);
        this.apiService = TestBed.get(ApiService);
        this.tokenService = TestBed.get(AuthTokenService);
    });

    describe('signIn()', () => {

        const userDetails = {email: 'user@example.com', password: 'password1'};

        describe('when email and password entered', () => {

            it('should call POST /api/auth/sign_in with user details specified', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN}));

                this.authService.signIn(userDetails);

                expect(this.apiService.post).toHaveBeenCalledWith('/api/auth/sign_in', userDetails);
            });
        });
    });
});
