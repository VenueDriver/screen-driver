import {Periodicity} from "../../../core/enums/periodicity";
import {ValidationResult} from "../models/validation-result.model";
import {EventTime} from "../models/event-time.model";
import {EventDateUtils} from "./event-date.utils";

import * as _ from 'lodash';

export class EventTimeValidator {

    static validate(eventTime: EventTime): ValidationResult {
        if (_.isEmpty(eventTime.daysOfWeek)) {
            return {isValid: false, validationMessage: 'You should choose at least one day of week'};
        }

        if (!EventTimeValidator.isDateValid(eventTime)) {
            return {isValid: false, validationMessage: 'The start and the end date should be specified'};
        }
        if (eventTime.startDate.getTime() === eventTime.endDate.getTime() || eventTime.periodicity !== Periodicity.ONE_TIME) {
            let isTimeValid = EventTimeValidator.isTimeValid(eventTime);
            return {isValid: isTimeValid, validationMessage: isTimeValid ? '' : 'The end of the event couldn\'t be before the start'};
        }
        return {isValid: true};
    }

    private static isDateValid(eventTime: EventTime): boolean {
        if (eventTime.periodicity === Periodicity.ONE_TIME) {
            return !!(eventTime.startDate && eventTime.endDate);
        }
        return true;
    }

    private static isTimeValid(eventTime: EventTime): boolean {
        let startTime = EventDateUtils.convertTimeToDate(eventTime.startTime, eventTime.startTimePeriod);
        let endTime = EventDateUtils.convertTimeToDate(eventTime.endTime, eventTime.endTimePeriod);
        return endTime > startTime;
    }
}
