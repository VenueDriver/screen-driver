import {Injectable, OnInit} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import * as AuthConsts from "./auth/auth-consts";
import {Observable} from "rxjs";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authReq = req.clone({setHeaders: {Authorization: localStorage.getItem(AuthConsts.ID_TOKEN_PARAM)}});
        return next.handle(authReq);
    }

}
