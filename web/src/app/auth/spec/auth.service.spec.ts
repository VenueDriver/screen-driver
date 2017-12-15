
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
import {Router} from "@angular/router";

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
const ID_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MTIwODY0MDAsImV4cCI6MTUxMjA4NjQ2MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoidXNlcklkIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwidXNlcklkIjoidXNlcklkIiwiY3VzdG9tOmFkbWluIjoidHJ1ZSJ9.wOtrdPsTC1tcSk65kDEBLuR9w6B5fg8CoMDBDjlODDM';

class MockRouter {
    navigateByUrl(url: string) {
        return url;
    }
}

describe('Service: AuthService', () => {

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
                { provide: Router, useClass: MockRouter }
            ]
        });

        this.authService = TestBed.get(AuthService);
        this.apiService = TestBed.get(ApiService);
        this.tokenService = TestBed.get(AuthTokenService);
        this.router = TestBed.get(Router);
    });

    describe('signIn()', () => {

        describe('when email and password entered', () => {

            const userDetails = {email: 'user@example.com', password: 'password1'};

            it('should call POST /api/auth/sign_in with user details specified', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN}));

                this.authService.signIn(userDetails);

                expect(this.apiService.post).toHaveBeenCalledWith('/api/auth/sign_in', userDetails);
            });

            it('should save ID token in token service', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN}));

                this.authService.signIn(userDetails);

                this.tokenService.getLastToken().subscribe(token => {
                    expect(token).toBe(ID_TOKEN);
                });
            });

            it('should save user details', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN}));

                this.authService.signIn(userDetails);

                let savedUser = this.authService.currentUser.getValue();
                expect(savedUser.id).toBe('userId');
                expect(savedUser.email).toBe('user@example.com');
                expect(savedUser.isAdmin).toBe(true);
            });

            it('should navigate user to the main page', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN}));
                spyOn(this.router, 'navigateByUrl');

                this.authService.signIn(userDetails);

                expect(this.router.navigateByUrl).toHaveBeenCalledWith('');
            });

            it('should return observable of response with tokens', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN}));

                this.authService.signIn(userDetails).subscribe((response) => {
                    expect(response).toEqual({token: ID_TOKEN});
                });
            });
        });

        describe('when email, user password and temporary password entered', () => {

            const userDetails = {email: 'user@example.com', password: 'password1', temporaryPassword: 'tempoPassword'};

            it('should call POST /api/auth/sign_in with user details specified', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN}));

                this.authService.signIn(userDetails);

                expect(this.apiService.post).toHaveBeenCalledWith('/api/auth/sign_in', userDetails);
            });

        });

        describe('when server respond with an error', () => {

            const userDetails = {email: 'user@example.com', password: 'password1'};

            it('should return observable of received error', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({error: 'ERROR'}));

                this.authService.signIn(userDetails).subscribe(
                    () => {},
                    (error) => {
                        expect(error).toEqual('ERROR');
                    });
            });

        });
    });
});
