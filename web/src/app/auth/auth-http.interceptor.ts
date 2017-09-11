import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from "rxjs";
import {AuthTokenService} from "./auth-token.service";

import * as _ from 'lodash';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

    constructor(private authTokenService: AuthTokenService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authTokenService
            .token
            .map(token => {
                if (!_.isEmpty(token)) {
                    return req.clone({headers: req.headers.set('Authorization', token)});
                }
                return req;
            })
            .concatMap(authReq => next.handle(authReq))
            .catch((err, restart) => {
                if (err instanceof HttpErrorResponse && err.status === 403) {
                    return Observable.concat(this.authTokenService.refreshToken, restart);
                }
                throw err;
            });
    }

}
