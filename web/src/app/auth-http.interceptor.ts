import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import * as AuthConsts from "./auth/auth-consts";
import {Observable} from "rxjs";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = AuthHttpInterceptor.getHeaders();
        const authReq = req.clone({setHeaders: headers});
        return next.handle(authReq);
    }

    private static getHeaders() {
        let headers = {};
        let authToken = localStorage.getItem(AuthConsts.ID_TOKEN_PARAM);
        if (authToken) {
            headers['Authorization'] = authToken;
        }
        return headers;
    }

}
