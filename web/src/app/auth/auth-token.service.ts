import {Observable, BehaviorSubject, Subject} from "rxjs";
import {Injectable} from "@angular/core";

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

    private getLastToken(): Observable<string> {
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
