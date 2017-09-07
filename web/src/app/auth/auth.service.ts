import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

import * as AuthConsts from "./auth-consts";
import * as _ from 'lodash';
import {JwtHelper} from 'angular2-jwt';
import {HttpClient} from "@angular/common/http";
import {User} from "./user";

const AUTH_API = `${environment.apiUrl}/api/auth`;

@Injectable()
export class AuthService {
    private jwtHelper = new JwtHelper();

    constructor(private httpClient: HttpClient,
                private router: Router) {
    }

    signIn(userDetails) {
        let subject = new Subject();
        this.httpClient.post(AUTH_API, userDetails)
            .subscribe(
                response => {
                    let user = this.parseUserData(response['token']);
                    localStorage.setItem(AuthConsts.ID_TOKEN_PARAM, response['token']);
                    localStorage.setItem(AuthConsts.USER_INFO, JSON.stringify(user));
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

    authenticated(): boolean {
        return !!localStorage.getItem(AuthConsts.ID_TOKEN_PARAM);
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

    isAuthPage(): boolean {
        return this.isCurrentPath('/auth');
    }

    private getCurrentPageUri() {
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
        let user = localStorage.getItem(AuthConsts.USER_INFO);
        return JSON.parse(user) as User;
    }

}
