import {Pipe, PipeTransform} from "@angular/core";
import {format, addHours} from 'date-fns'

import * as _ from 'lodash';

@Pipe({
    name: 'formatDate'
})
export class DateFormatterPipe implements PipeTransform {

    transform(date: Date|string, timezone?: number): string {
        if (typeof date === 'string' && isNaN(Date.parse(date))) {
            return "";
        }

        //format() perform a new Date() out of the box, but this date will have current timezone.
        //We should get rid of this timezone using getDateForOriginalTimezone(), if we want to have date for specific timezone;
        let dateToTransform = _.isEmpty(timezone) ? this.getDateForOriginalTimezone(date, timezone) : date;
        return format(dateToTransform, 'MMM D, YYYY [at] hh:mm A');
    }

    private getDateForOriginalTimezone(date: Date | string, timezone: number): Date {
        date = this.addTimezoneOffsetToUtcDate(date, timezone);
        let dateMilliseconds: number = Date.parse(date.toString());
        let utcDateString = new Date(dateMilliseconds).toUTCString();
        let utcDateNumber = Date.parse(utcDateString);

        //timezone offset(in minutes) + 60(seconds in minute) + 1000(millisecond in second)
        //NOTE: offset can be can be and positive and negative
        let timezoneDifference = new Date().getTimezoneOffset() * 60 * 1000;
        return new Date(utcDateNumber + timezoneDifference);
    }

    addTimezoneOffsetToUtcDate(date, timezone) {
        let utcDateString = new Date(date).toUTCString();
        let kioskTime = addHours(utcDateString, timezone);
        return kioskTime.toUTCString();
    }
}
