import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

import * as _ from 'lodash';

@Injectable()
export class DataLoadingMonitorService {
    private requests = [];
    private requestsPerforming = new Subject<boolean>();
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
