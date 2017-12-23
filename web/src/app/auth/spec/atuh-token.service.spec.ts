import {TestBed} from "@angular/core/testing";
import {AuthTokenService} from "../auth-token.service";
import {LocalStorageService} from "../local-storage.service";

describe('Service: AuthTokenService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthTokenService
            ]
        });

        this.tokenService = TestBed.get(AuthTokenService);
    });

    describe('getLastToken()', () => {

        describe('when token exists in local storage', () => {
            it('should return observable with token', () => {
                LocalStorageService.setIdToken('tokenFromLocalStorage');

                this.tokenService.getLastToken().subscribe(token => {
                    expect(token).toBe('tokenFromLocalStorage');
                });
            });
        });

        describe('when token exists in idToken subject', () => {
            it('should return observable with token', () => {
                LocalStorageService.clear();
                this.tokenService.setToken('tokeFromSubject');

                this.tokenService.getLastToken().subscribe(token => {
                    expect(token).toBe('tokeFromSubject');
                });
            });
        });

        describe('when token is not exist', () => {
            it('should return observable with empty object', () => {
                LocalStorageService.clear();

                this.tokenService.getLastToken().subscribe(token => {
                    expect(token).toEqual({});
                });
            });
        });

    });

});
