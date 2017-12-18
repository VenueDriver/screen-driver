
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
import {UsersFixture} from "./fixtures/users.fixture";
import {LocalStorageService} from "../local-storage.service";
import {JwtFixture} from "./fixtures/jwt.fixture";

import * as AuthConsts from "../auth-consts";

const ID_TOKEN_FOR_ADMIN = JwtFixture.getIdTokenForAdmin();
const ID_TOKEN_FOR_OPERATOR = JwtFixture.getIdTokenForOperator();
const ACCESS_TOKEN = JwtFixture.getAccessToken();
const REFRESH_TOKEN = JwtFixture.getRefreshToken();

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

        LocalStorageService.setRollbackUrl('');
    });

    describe('signIn()', () => {

        describe('when email and password entered', () => {

            const userDetails = {email: 'user@example.com', password: 'password1'};
            const serverResponseWhenAdminSignedIn = {
                token: ID_TOKEN_FOR_ADMIN,
                accessToken: ACCESS_TOKEN,
                refreshToken: REFRESH_TOKEN
            };
            const serverResponseWhenOperatorSignedIn = {
                token: ID_TOKEN_FOR_OPERATOR,
                accessToken: ACCESS_TOKEN,
                refreshToken: REFRESH_TOKEN
            };

            it('should call POST /api/auth/sign_in with user details specified', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenAdminSignedIn));

                this.authService.signIn(userDetails);

                expect(this.apiService.post).toHaveBeenCalledWith('/api/auth/sign_in', userDetails);
            });

            it('should save ID token in token service', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenAdminSignedIn));

                this.authService.signIn(userDetails);

                this.tokenService.getLastToken().subscribe(token => {
                    expect(token).toBe(ID_TOKEN_FOR_ADMIN);
                });
            });

            it('should save id, access and refresh tokens in local storage', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenAdminSignedIn));

                this.authService.signIn(userDetails);

                expect(localStorage.getItem('id_token')).toBe(ID_TOKEN_FOR_ADMIN);
                expect(localStorage.getItem('access_token')).toBe(ACCESS_TOKEN);
                expect(localStorage.getItem('refresh_token')).toBe(REFRESH_TOKEN);
            });

            it('should save admin user details in observable', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenAdminSignedIn));

                this.authService.signIn(userDetails);

                let savedUser = this.authService.currentUser.getValue();
                expect(savedUser.id).toBe('userId');
                expect(savedUser.email).toBe('user@example.com');
                expect(savedUser.isAdmin).toBe(true);
            });

            it('should save admin user details in local storage', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenAdminSignedIn));

                this.authService.signIn(userDetails);

                expect(localStorage.getItem('user_id')).toBe('userId');
                expect(localStorage.getItem('user_email')).toBe('user@example.com');
                expect(localStorage.getItem('user_is_admin')).toBe('true');
            });

            it('should save operator user details in observable', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenOperatorSignedIn));

                this.authService.signIn(userDetails);

                let savedUser = this.authService.currentUser.getValue();
                expect(savedUser.id).toBe('operatorId');
                expect(savedUser.email).toBe('operator@example.com');
                expect(savedUser.isAdmin).toBe(false);
            });

            it('should save operator user details in local storage', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenOperatorSignedIn));

                this.authService.signIn(userDetails);

                expect(localStorage.getItem('user_id')).toBe('operatorId');
                expect(localStorage.getItem('user_email')).toBe('operator@example.com');
                expect(localStorage.getItem('user_is_admin')).toBe('false');
            });

            it('should navigate user to the main page', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenAdminSignedIn));
                spyOn(this.router, 'navigateByUrl');

                this.authService.signIn(userDetails);

                expect(this.router.navigateByUrl).toHaveBeenCalledWith('');
            });

            it('should return observable of response with tokens', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(serverResponseWhenAdminSignedIn));

                this.authService.signIn(userDetails).subscribe((response) => {
                    expect(response).toEqual(serverResponseWhenAdminSignedIn);
                });
            });
        });

        describe('when email, user password and temporary password entered', () => {

            const userDetailsWithTemporaryPassword =
                {email: 'user@example.com', password: 'password1', temporaryPassword: 'tempoPassword'};

            it('should call POST /api/auth/sign_in with user details specified', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN_FOR_ADMIN}));

                this.authService.signIn(userDetailsWithTemporaryPassword);

                expect(this.apiService.post)
                    .toHaveBeenCalledWith('/api/auth/sign_in', userDetailsWithTemporaryPassword);
            });

        });

        describe('when \'/settings\' saved as rollback URL in local storage', () => {

            const userDetails = {email: 'user@example.com', password: 'password1'};

            it('should navigate user to \'/settings\' page', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({token: ID_TOKEN_FOR_ADMIN}));
                spyOn(this.router, 'navigateByUrl');
                LocalStorageService.setRollbackUrl('/settings');

                this.authService.signIn(userDetails);

                expect(this.router.navigateByUrl).toHaveBeenCalledWith('/settings');
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

    describe('isAdmin()', () => {

        describe('when user signed in', () => {

            describe('when user has admin rights', () => {

                const user = UsersFixture.getUserWithAdminRights();

                it('should return true', () => {
                    this.authService.currentUser.next(user);

                    let result = this.authService.isAdmin();
                    expect(result).toBeTruthy();
                });
            });

            describe('when has not admin rights', () => {

                const user = UsersFixture.getUserWithOperatorRights();

                it('should return false', () => {
                    this.authService.currentUser.next(user);

                    let result = this.authService.isAdmin();
                    expect(result).toBeFalsy();
                });
            });

        });

        describe('when user is not signed in', () => {
            it('should return false', () => {
                let result = this.authService.isAdmin();
                expect(result).toBeFalsy();
            });
        });

    });

    describe('isAuthPage()', () => {

        describe('when window.location.hash is #/auth', () => {
            it('should return true', () => {
                window.location.hash = '#/auth';
                let result = this.authService.isAuthPage();
                expect(result).toBeTruthy();
            });
        });

        describe('when window.location.hash is #/settings', () => {
            it('should return true', () => {
                window.location.hash = '#/settings';
                let result = this.authService.isAuthPage();
                expect(result).toBeFalsy();
            });
        });

        describe('when window.location.hash is #/auth/first', () => {
            it('should return true', () => {
                window.location.hash = '#/auth/first';
                let result = this.authService.isAuthPage();
                expect(result).toBeTruthy();
            });
        });

    });

    describe('saveCurrentUrlAsRollback()', () => {

        describe('when window.location.hash is #/settings', () => {
            it('should call setRollbackUrl() with \'/settings\'', () => {
                window.location.hash = '#/settings';
                spyOn(LocalStorageService, 'setRollbackUrl');

                this.authService.saveCurrentUrlAsRollback();
                expect(LocalStorageService.setRollbackUrl).toHaveBeenCalledWith('/settings');
            });
        });

        describe('when window.location.hash is #/auth', () => {
            it('should not call setRollbackUrl()', () => {
                window.location.hash = '#/auth';
                spyOn(LocalStorageService, 'setRollbackUrl');

                this.authService.saveCurrentUrlAsRollback();
                expect(LocalStorageService.setRollbackUrl).toHaveBeenCalledTimes(0);
            });
        });

        describe('when window.location.hash is #/auth/reset-password', () => {
            it('should not call setRollbackUrl()', () => {
                window.location.hash = '#/auth/reset-password';
                spyOn(LocalStorageService, 'setRollbackUrl');

                this.authService.saveCurrentUrlAsRollback();
                expect(LocalStorageService.setRollbackUrl).toHaveBeenCalledTimes(0);
            });
        });

    });

    describe('isCurrentPathEqualTo()', () => {

        describe('when current path is \'#/content\'', () => {

            describe('when called with \'/content\'', () => {
                it('should return true', () => {
                    window.location.hash = '#/content';

                    let result = this.authService.isCurrentPathEqualTo('/content');
                    expect(result).toBeTruthy();
                });
            });

            describe('when called with \'/settings\'', () => {
                it('should return true', () => {
                    window.location.hash = '#/content';

                    let result = this.authService.isCurrentPathEqualTo('/settings');
                    expect(result).toBeFalsy();
                });
            });

        });

        describe('when current path is \'#/content-list\'', () => {

            describe('when called with \'/content-list\'', () => {
                it('should return true', () => {
                    window.location.hash = '#/content-list';

                    let result = this.authService.isCurrentPathEqualTo('/content-list');
                    expect(result).toBeTruthy();
                });
            });

            describe('when called with \'/settings\'', () => {
                it('should return true', () => {
                    window.location.hash = '#/content-list';

                    let result = this.authService.isCurrentPathEqualTo('/settings');
                    expect(result).toBeFalsy();
                });
            });

            describe('when called with \'/content-list/125\'', () => {
                it('should return true', () => {
                    window.location.hash = '#/content-list';

                    let result = this.authService.isCurrentPathEqualTo('/content-list/125');
                    expect(result).toBeFalsy();
                });
            });

        });

    });

    describe('signOut()', () => {

        describe('when user is signed in', () => {

            const user = UsersFixture.getUserWithAdminRights();

            it('should clear local storage', () => {
                this.authService.currentUser.next(user);

                this.authService.signOut();

                expect(localStorage.getItem(AuthConsts.ID_TOKEN_PARAM)).toBeNull();
                expect(localStorage.getItem(AuthConsts.REFRESH_TOKEN_PARAM)).toBeNull();
                expect(localStorage.getItem(AuthConsts.ACCESS_TOKEN_PARAM)).toBeNull();
                expect(localStorage.getItem(AuthConsts.USER_EMAIL)).toBeNull();
                expect(localStorage.getItem(AuthConsts.USER_ID)).toBeNull();
                expect(localStorage.getItem(AuthConsts.USER_IS_ADMIN)).toBeNull();
            });

            it('should call POST /api/auth/sign_out with user email', () => {
                this.authService.currentUser.next(user);
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({}));

                this.authService.signOut();

                expect(this.apiService.post).toHaveBeenCalledWith('/api/auth/sign_out', {email: user.email});
            });

            it('should clear currentUser', () => {
                this.authService.currentUser.next(user);

                this.authService.signOut();

                expect(this.authService.currentUser.getValue()).toBeNull();
            });

            it('should save \'/\' as rollback URL', () => {
                this.authService.currentUser.next(user);

                this.authService.signOut();

                expect(localStorage.getItem('rollbackUrl')).toBe('/');
            });

            it('should navigate user to the auth page', () => {
                this.authService.currentUser.next(user);
                spyOn(this.router, 'navigateByUrl');

                this.authService.signOut();

                expect(this.router.navigateByUrl).toHaveBeenCalledWith('/auth');
            });
        });

        describe('when rollback URL is set to \'/settings\'', () => {

            const user = UsersFixture.getUserWithAdminRights();
            localStorage.setItem('rollbackUrl', '/settings');

            it('should save \'/\' as rollback URL', () => {
                this.authService.currentUser.next(user);

                this.authService.signOut();

                expect(localStorage.getItem('rollbackUrl')).toBe('/');
            });
        });

        describe('when user is not signed in', () => {
            it('should not call POST /api/auth/sign_out', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of({}));

                this.authService.signOut();

                expect(this.apiService.post).toHaveBeenCalledTimes(0);
            });
        });

    });

    describe('refreshToken()', () => {

        beforeEach(() => {
            localStorage.setItem('id_token', ID_TOKEN_FOR_ADMIN);
            localStorage.setItem('access_token', ACCESS_TOKEN);
            localStorage.setItem('refresh_token', REFRESH_TOKEN);
        });

        const responseWithUpdatedTokens = {
            token: JwtFixture.getUpdatedIdTokenForAdmin(),
            accessToken: JwtFixture.getUpdateAccessToken()
        };

        describe('when called', () => {
            it('should call POST /api/auth/token/refresh with refresh token', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(responseWithUpdatedTokens));

                this.authService.refreshToken();

                expect(this.apiService.post).toHaveBeenCalledWith('/api/auth/token/refresh', {refreshToken: REFRESH_TOKEN});
            });

            it('should save updated id and access tokens in local storage', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(responseWithUpdatedTokens));

                this.authService.refreshToken();

                expect(localStorage.getItem('id_token')).toBe(JwtFixture.getUpdatedIdTokenForAdmin());
                expect(localStorage.getItem('access_token')).toBe(JwtFixture.getUpdateAccessToken());
            });

            it('should save ID token in token service', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(responseWithUpdatedTokens));

                this.authService.refreshToken();

                this.tokenService.getLastToken().subscribe(token => {
                    expect(token).toBe(JwtFixture.getUpdatedIdTokenForAdmin());
                });
            });

            it('should save user details in observable', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(responseWithUpdatedTokens));

                this.authService.refreshToken();

                let savedUser = this.authService.currentUser.getValue();
                expect(savedUser.id).toBe('userId');
                expect(savedUser.email).toBe('user@example.com');
                expect(savedUser.isAdmin).toBe(true);
            });

            it('should save user details in local storage', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(responseWithUpdatedTokens));

                this.authService.refreshToken();

                expect(localStorage.getItem('user_id')).toBe('userId');
                expect(localStorage.getItem('user_email')).toBe('user@example.com');
                expect(localStorage.getItem('user_is_admin')).toBe('true');
            });

            it('should return observable of response with updated tokens', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(responseWithUpdatedTokens));

                this.authService.refreshToken().subscribe((response) => {
                    expect(response).toEqual(responseWithUpdatedTokens);
                });
            });
        });

        describe('when server respond with a server error', () => {
            it('should return observable with received error message', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 501, error: 'ERROR'}));

                this.authService.refreshToken().subscribe(
                    () => {},
                    (error) => expect(error).toEqual({status: 501, error: 'ERROR'})
                );
            });

            it('should not sign out user', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 501, error: 'ERROR'}));
                spyOn(this.authService, 'signOut');

                this.authService.refreshToken();

                expect(this.authService.signOut).toHaveBeenCalledTimes(0);
            });
        });

        describe('when server respond with 401 error', () => {
            it('should return observable with received error', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 401, error: 'ERROR'}));

                this.authService.refreshToken().subscribe(
                    () => {},
                    (error) => expect(error).toEqual({status: 401, error: 'ERROR'})
                );
            });

            it('should sign out user', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 401, error: 'ERROR'}));
                spyOn(this.authService, 'signOut');

                this.authService.refreshToken();

                expect(this.authService.signOut).toHaveBeenCalled();
            });
        });

    });

});
