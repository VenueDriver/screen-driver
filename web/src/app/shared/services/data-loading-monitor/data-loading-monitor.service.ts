import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

import * as _ from 'lodash';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class DataLoadingMonitorService {
    private requests = [];
    private requestsPerforming = new BehaviorSubject<boolean>(null);
    public requestsPerformingStateObservable: Observable<boolean> = this.requestsPerforming.asObservable();

    constructor() {
    }

    registerRequest(incomingRequest: Observable<Object>) {
        if (this.requests.length == 0) {
            this.requestsPerforming.next(true);
        }
        this.requests.push(incomingRequest);
    }

    registerRequestEnding(finishedRequest: Observable<Object>) {
        _.pull(this.requests, finishedRequest);

        if (this.requests.length == 0) {
            this.requestsPerforming.next(false);
        }
    }

}
