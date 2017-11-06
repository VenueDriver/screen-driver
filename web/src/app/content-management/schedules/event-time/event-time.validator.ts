import {Periodicity} from "../../../core/enums/periodicity";
import {ValidationResult} from "../models/validation-result.model";
import {EventTime} from "../models/event-time.model";
import {EventDateUtils} from "./event-date.utils";

import * as _ from 'lodash';

export const EMPTY_WEEK_DAYS_ERROR_MESSAGE = 'You should choose at least one day of week';
export const INVALID_DATE_ERROR_MESSAGE = 'The start and the end date should be specified';
export const INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE = 'The end of the event couldn\'t be before the start';

export class EventTimeValidator {

    static validate(eventTime: EventTime): ValidationResult {
        if (_.isEmpty(eventTime.weekDays)) {
            return EventTimeValidator.generateValidationResultWithError(EMPTY_WEEK_DAYS_ERROR_MESSAGE);
        }

        if (EventTimeValidator.isDateInvalid(eventTime)) {
            return EventTimeValidator.generateValidationResultWithError(INVALID_DATE_ERROR_MESSAGE);
        }

        if (EventTimeValidator.isOneDayEvent(eventTime) && EventTimeValidator.isEventTimeRangeInvalid(eventTime)) {
            return EventTimeValidator.generateValidationResultWithError(INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE);
        }

        return {isValid: true};
    }

    private static isDateInvalid(eventTime: EventTime): boolean {
        return eventTime.periodicity === Periodicity.ONE_TIME
            && !(eventTime.startDate && eventTime.endDate);
    }

    private static isOneDayEvent(eventTime: EventTime): boolean {
        return eventTime.periodicity === Periodicity.REPEATABLE
            || eventTime.startDate.getTime() === eventTime.endDate.getTime();
    }

    private static isEventTimeRangeInvalid(eventTime: EventTime): boolean {
        let startTime = EventDateUtils.convertTimeToDate(eventTime.startTime, eventTime.startTimePeriod);
        let endTime = EventDateUtils.convertTimeToDate(eventTime.endTime, eventTime.endTimePeriod);
        return endTime <= startTime;
    }

    private static generateValidationResultWithError(validationMessage: string): ValidationResult {
        return {isValid: false, validationMessage: validationMessage};
    }
}
