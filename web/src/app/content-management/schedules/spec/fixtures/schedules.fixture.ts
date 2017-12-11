import * as _ from 'lodash';
import {Schedule} from "../../models/schedule.model";

export class SchedulesFixture {

    static getSchedulesInfo(count: number): Array<Schedule> {
        return _.range(count).map(index => {
            const schedule = new Schedule();
            schedule.id = index;
            return schedule;
        });
    }

    static getOneTimeSchedule(scheduleId?: string): Schedule {
        let schedule = new Schedule();
        if (scheduleId) schedule.id = scheduleId;
        schedule.settingId = '';
        schedule.eventCron = '0 0 8 1 JAN * 2017';
        schedule.endEventCron = '0 0 13 1 JAN * 2017';
        schedule.periodicity = 'ONE_TIME';
        return schedule;
    }

    static getRepeatableSchedule(scheduleId?: string): Schedule {
        let schedule = new Schedule();
        if (scheduleId) schedule.id = scheduleId;
        schedule.settingId = '';
        schedule.eventCron = '0 0 8 * * SUN';
        schedule.endEventCron = '0 0 13 * * SUN';
        schedule.periodicity = 'REPEATABLE';
        return schedule;
    }

}
