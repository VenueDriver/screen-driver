import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";

import * as AuthConsts from "./auth-consts";
import * as _ from 'lodash';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {HttpClient} from "@angular/common/http";
import {User} from "../core/entities/user";
import {AuthTokenService} from "./auth-token.service";
import {ErrorMessageExtractor} from "../core/error-message-extractor";
import {LocalStorageService} from "./local-storage.service";

@Injectable()
export class AuthService {

    private jwtHelper = new JwtHelper();
    currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
    unauthorizedUserEmail: Subject<string> = new BehaviorSubject(null);

    constructor(private httpClient: HttpClient,
                private router: Router,
                private tokenService: AuthTokenService) {

        this.tokenService.performTokenRefresh.subscribe(() => {
            if (!this.isAuthPage()) {
                this.refreshToken();
            }
        });
        this.checkSessionExpiration();
    }

    checkSessionExpiration() {
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
        this.httpClient.post(AuthConsts.SIGN_IN_API, userDetails)
            .subscribe(
                response => {
                    this.saveAuthTokens(response);
                    this.setCurrentUserFromToken(response['token']);
                    subject.next(response);
                    this.redirect();
                },
                error => {
                    let errorMessage = ErrorMessageExtractor.extractMessage(error);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    setCurrentUserFromToken(token: string) {
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
        let url = document.location.href;
        let origin = document.location.origin;
        let rollbackUrl = url.replace(origin, '');
        if (this.isNotExclusivePage()) {
            LocalStorageService.setRollbackUrl(rollbackUrl.slice(2));
        }
    }

    isNotExclusivePage(): boolean {
        let path = this.getCurrentPageUri();
        return !AuthConsts.EXCLUSIVE_URLS.includes(path.substr(1));
    }

    getCurrentPageUri() {
        return document.location.hash.replace('#', '');
    }

    redirect() {
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

    getUserInfo(): User {
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
        this.router.navigateByUrl(AuthConsts.AUTH_URI);
    }

    private signOutUserOnServer() {
        if (!_.isEmpty(this.currentUser.getValue())) {
            let email = this.currentUser.getValue().email;
            this.sendSignOutRequest(email);
        }
    }

    private sendSignOutRequest(email: string) {
        this.httpClient.post(AuthConsts.SIGN_OUT_API, {email: email}).subscribe()
    }

    refreshToken() {
        let subject = new Subject();
        let refreshToken = LocalStorageService.getRefreshToken();
        this.httpClient.post(AuthConsts.TOKEN_REFRESH_API, {refreshToken: refreshToken}).subscribe(
            (response) => {
                LocalStorageService.setIdToken(response['token']);
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

    getUsernameFromEmail(email: string) {
        return email.substr(0, email.indexOf('@'));
    }

}
