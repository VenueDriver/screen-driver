import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Subject, BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";

import * as AuthConsts from "./auth-consts";
import * as _ from 'lodash';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {HttpClient} from "@angular/common/http";
import {User} from "./user";

const AUTH_API = `${environment.apiUrl}/api/auth`;
const SIGN_OUT_API = `${environment.apiUrl}/api/sign_out`;

@Injectable()
export class AuthService {
    private jwtHelper = new JwtHelper();
    currentUser: BehaviorSubject<User> = new BehaviorSubject(null);

    constructor(private httpClient: HttpClient,
                private router: Router) {
        this.checkSessionExpiration();
    }

    checkSessionExpiration() {
        return Observable
            .interval(3 * 1000)
            .subscribe(() => {
                if (!this.authenticated() && !this.isAuthPage() && tokenNotExpired()) {
                    this.signOut();
                }
            });
    }

    signIn(userDetails) {
        let subject = new Subject();
        this.httpClient.post(AUTH_API, userDetails)
            .subscribe(
                response => {
                    this.saveTokens(response)
                    this.initCurrentUser(response['token']);
                    subject.next(response);
                    this.redirect();
                },
                error => {
                    let errorMessage = this.getErrorMessage(error);
                    subject.error(errorMessage);
                }
            );
        return subject;
    }

    private getErrorMessage(error): string {
        return error.error ? error.error.message.message : error.message;
    }

    saveTokens(response: Object) {
        localStorage.setItem(AuthConsts.ID_TOKEN_PARAM, response['token']);
        localStorage.setItem(AuthConsts.REFRESH_TOKEN_PARAM, response['refreshToken']);
    }

    initCurrentUser(token: string) {
        let user = this.parseUserData(token);
        localStorage.setItem(AuthConsts.USER_EMAIL, user.email);
        localStorage.setItem(AuthConsts.USER_IS_ADMIN, user.isAdmin.toString());
        this.currentUser.next(user);
    }

    authenticated(): boolean {
        if (_.isEmpty(this.currentUser.getValue())){
            this.currentUser.next(this.getUserInfo());
        }
        return !!this.currentUser.getValue();
    }

    isAdmin(): boolean {
        return this.authenticated() && this.currentUser.getValue().isAdmin;
    }

    isAuthPage(): boolean {
        return _.isEqual(this.getCurrentPageUri(), AuthConsts.AUTH_URI);
    }

    saveCurrentUrlAsRollback() {
        let url = document.location.href;
        let origin = document.location.origin;
        let rollbackUrl = url.replace(origin, '');
        if (this.isNotExclusivePage()) {
            localStorage.setItem(AuthConsts.ROLLBACK_URL_PARAM, rollbackUrl.slice(2));
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
        let callbackUrl = localStorage.getItem(AuthConsts.ROLLBACK_URL_PARAM);
        this.router.navigateByUrl(callbackUrl);
    }

    isCurrentPath(path: string): boolean {
        let currentPath = this.getCurrentPageUri();
        return _.isEqual(currentPath, path);
    }

    private parseUserData(token: string): User {
        token = token.replace('Bearer ', '');
        let decodedToken = this.jwtHelper.decodeToken(token);
        let user = new User();
        user.email = decodedToken.email;
        user.isAdmin = decodedToken['custom:admin'];
        return user;
    }

    getUserInfo(): User {
        let email = localStorage.getItem(AuthConsts.USER_EMAIL);
        let isAdmin = localStorage.getItem(AuthConsts.USER_IS_ADMIN);
        let user = new User();
        user.email = email;
        user.isAdmin = JSON.parse(isAdmin);
        return email || isAdmin ? user : null;
    }

    signOut() {
        localStorage.removeItem(AuthConsts.ID_TOKEN_PARAM);
        localStorage.removeItem(AuthConsts.REFRESH_TOKEN_PARAM);
        localStorage.removeItem(AuthConsts.USER_EMAIL);
        localStorage.removeItem(AuthConsts.USER_IS_ADMIN);
        let email = this.currentUser.getValue().email;

        this.sendSignOutRequest(email);
        this.router.navigateByUrl(AuthConsts.AUTH_URI);
    }

    private sendSignOutRequest(email: string) {
        this.httpClient.post(SIGN_OUT_API, {email: email}).subscribe()
    }

}
