import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";

import * as _ from 'lodash';

const EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION = '0 0 1 * * * *';

@Injectable()
export class AutoupdateScheduleService {

    readonly apiPath = `${environment.apiUrl}/api/screens/update-schedule`;

    constructor(private httpClient: HttpClient) { }

    loadAutoupdateSchedule(): Observable<any> {
        return this.httpClient.get(this.apiPath);
    }

    createDefaultAutoapdateSchedule(): AutoupdateSchedule {
        let autoupdateSchedule = new AutoupdateSchedule();
        autoupdateSchedule.eventTime = EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION;
        return autoupdateSchedule;
    }

    createSchedulesMap(schedules): any {
        let schedulesMap = {};
        _.each(schedules, s => schedulesMap[s.id] = s);
        return schedulesMap;
    }
}