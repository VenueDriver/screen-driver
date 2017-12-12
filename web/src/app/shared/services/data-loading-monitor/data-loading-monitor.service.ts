import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

import * as _ from 'lodash';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class DataLoadingMonitorService {
    private requests = [];
    private requestsPerforming = new BehaviorSubject<boolean>(null);
    public requestsPerformingStateObservable: Observable<boolean> = this.requestsPerforming.asObservable();
    private isServiceActive: boolean = true;

    constructor() {
    }

    registerRequest(incomingRequest: Observable<Object>) {
        if (!this.isServiceActive) return;

        if (this.requests.length == 0) {
            this.requestsPerforming.next(true);
        }
        this.requests.push(incomingRequest);
    }

    registerRequestEnding(finishedRequest: Observable<Object>) {
        _.pull(this.requests, finishedRequest);

        if (this.requests.length == 0) {
            this.requestsPerforming.next(false);
            this.isServiceActive = false;
        }
    }

}
