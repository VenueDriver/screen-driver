import {Observable, BehaviorSubject, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";
import * as _ from 'lodash';

@Injectable()
export class AuthTokenService {

    performTokenRefresh: Subject<any> = new BehaviorSubject<any>({});
    tokenReceived: Subject<any> = new BehaviorSubject<any>({});

    private idToken = new BehaviorSubject<string|null>(null);

    readonly refreshToken: Observable<any>;

    constructor() {
        this.refreshToken = Observable.defer(() => this.doRefreshToken());
        this.refreshToken.subscribe();
    }

    public setToken(token: string) {
        this.idToken.next(token);
    }

    public getLastToken(): Observable<string> {
        let token = LocalStorageService.getIdToken();
        if (!_.isEmpty(token)) {
            return new BehaviorSubject(token);
        }
        return this.idToken
            .filter(token => token !== null)
            .take(1);
    }

    private doRefreshToken() {
        this.idToken.next(null);

        return this.sendRefreshTokenEvent()
            .do(token => this.idToken.next(token))
            .ignoreElements()
            .shareReplay();
    }

    private sendRefreshTokenEvent(): Observable<string> {
        this.performTokenRefresh.next();
        return this.tokenReceived;
    }
}
