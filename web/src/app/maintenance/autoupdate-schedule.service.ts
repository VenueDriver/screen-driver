import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AutoupdateSchedule} from "./entities/autoupdate-schedule";

import * as _ from 'lodash';
import {ApiService} from "../shared/services/api.service";

const EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION = '0 0 1 * * * *';

@Injectable()
export class AutoupdateScheduleService {

    readonly servicePath = `/api/screens/update-schedule`;

    constructor(private apiService: ApiService) { }

    loadAutoupdateSchedule(): Observable<Array<AutoupdateSchedule>> {
        return this.apiService.get(this.servicePath);
    }

    upsert(schedule: AutoupdateSchedule): Observable<AutoupdateSchedule> {
        return this.apiService.put(this.servicePath, schedule);
    }

    createDefaultAutoapdateSchedule(): AutoupdateSchedule {
        let autoupdateSchedule = new AutoupdateSchedule(null);
        autoupdateSchedule.eventTime = EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION;
        return autoupdateSchedule;
    }

    createSchedulesMap(schedules): any {
        let schedulesMap = {};
        _.each(schedules, s => schedulesMap[s.id] = s);
        return schedulesMap;
    }
}
