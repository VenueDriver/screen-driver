import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";

import * as AuthConsts from "./auth-consts";
import * as _ from 'lodash';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {User} from "../core/entities/user";
import {AuthTokenService} from "./auth-token.service";
import {ErrorMessageExtractor} from "../core/error-message-extractor";
import {LocalStorageService} from "./local-storage.service";
import {ApiService} from "../shared/services/api.service";

@Injectable()
export class AuthService {

    private jwtHelper = new JwtHelper();
    currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
    unauthorizedUserEmail: Subject<string> = new BehaviorSubject(null);

    constructor(private apiService: ApiService,
                private router: Router,
                private tokenService: AuthTokenService) {

        this.tokenService.performTokenRefresh.subscribe(() => {
            if (!this.isAuthPage()) {
                this.refreshToken();
            }
        });
        this.checkSessionExpiration();
    }

    private checkSessionExpiration() {
        return Observable
            .interval(3 * 1000)
            .subscribe(() => {
                if (!this.authenticated() && !this.isAuthPage()) {
                    this.refreshToken();
                }
            });
    }

    signIn(userDetails) {
        let subject = new Subject();

        this.apiService.post(AuthConsts.SIGN_IN_API, userDetails)
            .subscribe(
                response => {
                    this.saveAuthTokens(response);
                    this.setCurrentUserFromToken(response['token']);
                    subject.next(response);
                    this.redirectToSavedUrl();
                },
                error => {
                    let errorMessage = ErrorMessageExtractor.extractMessage(error);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    private setCurrentUserFromToken(token: string) {
        let user = this.parseUserData(token);
        LocalStorageService.saveUserDetails(user);
        this.currentUser.next(user);
    }

    authenticated(): boolean {
        if (_.isEmpty(this.currentUser.getValue())){
            this.currentUser.next(this.getUserInfo());
        }
        return !!this.currentUser.getValue() && tokenNotExpired('id_token');
    }

    isAdmin(): boolean {
        return !_.isEmpty(this.currentUser.getValue()) && this.currentUser.getValue().isAdmin;
    }

    isAuthPage(): boolean {
        return this.getCurrentPageUri().includes(AuthConsts.AUTH_URI);
    }

    saveCurrentUrlAsRollback() {
        let rollbackUrl = this.getCurrentPageUri();
        if (this.isNotExclusivePage(rollbackUrl)) {
            LocalStorageService.setRollbackUrl(rollbackUrl);
        }
    }

    private isNotExclusivePage(path: string): boolean {
        return !_.find(AuthConsts.EXCLUSIVE_URLS, url => path.includes(url));
    }

    private getCurrentPageUri() {
        return document.location.hash.replace('#', '');
    }

    private redirectToSavedUrl() {
        let callbackUrl = LocalStorageService.getRollbackUrl();
        this.router.navigateByUrl(_.isEmpty(callbackUrl) ? '' : callbackUrl);
    }

    isCurrentPath(path: string): boolean {
        let currentPath = this.getCurrentPageUri();
        return _.isEqual(currentPath, path);
    }

    private parseUserData(token: string): User {
        token = token.replace('Bearer ', '');
        let decodedToken = this.jwtHelper.decodeToken(token);
        return this.initUserFromToken(decodedToken);
    }

    private initUserFromToken(decodedToken: any): User {
        let user = new User();
        user.id = decodedToken.sub;
        user.email = decodedToken.email;
        user.isAdmin = _.isEqual(decodedToken['custom:admin'], 'true');
        return user;
    }

    private getUserInfo(): User {
        let userDetails = LocalStorageService.getUserDetails();
        let user = new User();
        user.id = userDetails.userId;
        user.email = userDetails.email;
        user.isAdmin = JSON.parse(userDetails.isAdmin);
        return userDetails.email || userDetails.isAdmin ? user : null;
    }

    signOut() {
        LocalStorageService.clear();
        this.signOutUserOnServer();
        this.currentUser = new BehaviorSubject(null);
        this.saveMainPageAsRollback();
        this.router.navigateByUrl(AuthConsts.AUTH_URI);
    }

    private signOutUserOnServer() {
        if (!_.isEmpty(this.currentUser.getValue())) {
            let email = this.currentUser.getValue().email;
            this.sendSignOutRequest(email);
        }
    }

    private sendSignOutRequest(email: string) {
        this.apiService.post(AuthConsts.SIGN_OUT_API, {email: email}).subscribe()
    }

    private saveMainPageAsRollback() {
        LocalStorageService.setRollbackUrl('/');
    }

    refreshToken() {
        let subject = new Subject();
        let refreshToken = LocalStorageService.getRefreshToken();
        this.apiService.post(AuthConsts.TOKEN_REFRESH_API, {refreshToken: refreshToken}).subscribe(
            (response) => {
                LocalStorageService.setIdToken(response['token']);
                LocalStorageService.setAccessToken(response['accessToken']);
                this.tokenService.tokenReceived.next(response['token']);
                this.setCurrentUserFromToken(response['token']);
                subject.next(response);
            },
            (error) => {
                if (error.status === 401) {
                    this.signOut();
                }
                subject.error(error);
            });
        return subject;
    }

    private saveAuthTokens(response: any) {
        LocalStorageService.saveAuthTokens(response);
        this.tokenService.setToken(response['token']);
    }

    getCurrentUserLogin(): string {
        let user = this.currentUser.getValue();
        return _.isEmpty(user) ? '' : this.getUsernameFromEmail(user.email);
    }

    private getUsernameFromEmail(email: string) {
        return email.substr(0, email.indexOf('@'));
    }

}
