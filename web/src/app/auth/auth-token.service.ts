import {Observable, BehaviorSubject, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import * as AuthConsts from "./auth-consts";

@Injectable()
export class AuthTokenService {

    performTokenRefresh: Subject<any> = new BehaviorSubject<any>({});
    tokenReceived: Subject<any> = new BehaviorSubject<any>({});

    private subject = new BehaviorSubject<string|null>(null);

    readonly refreshToken: Observable<any>;
    readonly token: Observable<string>;

    constructor() {
        this.refreshToken = Observable.defer(() => this.doRefreshToken());
        this.token = this.getLastToken();
        this.refreshToken.subscribe();
    }

    private getLastToken(): Observable<string> {
        let token = localStorage.getItem(AuthConsts.ID_TOKEN_PARAM);
        return new BehaviorSubject(token);
    }

    private doRefreshToken() {
        this.subject.next(null);

        return this.sendRefreshTokenEvent()
            .do(token => this.subject.next(token))
            .ignoreElements()
            .shareReplay();
    }

    private sendRefreshTokenEvent(): Observable<string> {
        this.performTokenRefresh.next();
        return this.tokenReceived;
    }
}