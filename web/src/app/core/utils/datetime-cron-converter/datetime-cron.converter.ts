import {format} from 'date-fns';
import {getAllDaysString} from "../../enums/days-of-week";

import * as _ from 'lodash';

const WEEKDAYS = getAllDaysString();

export class DatetimeToCronConverter {

    static createCronForSpecificDate(date: Date): string {
        let dayOfMonth = date.getDate();
        let month = format(date, 'MMM').toUpperCase();
        let year = date.getFullYear();
        return `0 0 0 ${dayOfMonth} ${month} * ${year}`;
    }

    static createCronForWeekDays(weekDays: string): string {
        DatetimeToCronConverter._validateWeekDays(weekDays);
        return `* * * * * ${weekDays}`;
    }

    static setTimeForCron(cron: string, hour: number, minute: number): string {
        let cronDate = cron.substr(6);
        let dateTime = new Date(2017, 0, 1, hour, minute);
        return `0 ${dateTime.getMinutes()} ${dateTime.getHours()} ${cronDate}`;
    }

    static _validateWeekDays(weekDays: string) {
        if (!_.includes(WEEKDAYS, ...weekDays.split(','))) {
            throw new Error('Invalid weekday set');
        }
    }
}
