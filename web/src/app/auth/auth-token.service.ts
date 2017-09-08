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
        this.refreshToken = Observable.defer(() => {
            this.subject.next(null);

            return this.doRefreshToken()
                .do(token => this.subject.next(token))
                .ignoreElements()
                .shareReplay();
        });

        this.token = this.subject
            .filter(token => token !== null)
            .take(1);

        this.refreshToken.subscribe();
    }

    doRefreshToken(): Observable<string> {
        this.performTokenRefresh.next();
        return this.tokenReceived;
    }
}