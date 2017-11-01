import {Observable, BehaviorSubject, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import * as _ from 'lodash';

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

    public setToken(token) {
        this.subject.next(token);
    }

    getLastToken(): Observable<string> {
        let token = LocalStorageService.getIdToken();
        if (!_.isEmpty(token)) {
            return new BehaviorSubject(token);
        }
        return this.subject
            .filter(token => token !== null)
            .take(1);
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
