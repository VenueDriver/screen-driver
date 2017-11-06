import {EventTime} from "../../models/event-time.model";
import {
    EMPTY_WEEK_DAYS_ERROR_MESSAGE, EventTimeValidator, INVALID_DATE_ERROR_MESSAGE,
    INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE
} from "../event-time.validator";
import {Periodicity} from "../../../../core/enums/periodicity";
import {EventDateUtils} from "../event-date.utils";

describe('EventTimeValidator', () => {

    describe('validate()', () => {

        describe('when input is a default event time object', () => {
            const input = new EventTime();

            it('should return {isValid: true} without validation message', () => {
                let result = EventTimeValidator.validate(input);

                expect(result.isValid).toBeTruthy();
                expect(result.validationMessage).toBeUndefined();
            });

        });

        describe('when input is event time with empty weekdays', () => {
            const input = new EventTime();
            input.weekDays = '';

            it('should return {isValid: false} with validation message', () => {
                let result = EventTimeValidator.validate(input);

                expect(result.isValid).toBeFalsy();
                expect(result.validationMessage).toBe(EMPTY_WEEK_DAYS_ERROR_MESSAGE)
            });

        });

        describe('when input is event time with one time periodicity', () => {

            describe('and with both start and end date set up', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = new Date();

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });

            });

            describe('and with only start date set up ', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = null;

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_DATE_ERROR_MESSAGE);
                });

            });

            describe('and with only end date set up ', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = null;
                input.endDate = new Date();

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_DATE_ERROR_MESSAGE);
                });

            });

            describe('without date set up ', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = null;
                input.endDate = null;

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_DATE_ERROR_MESSAGE);
                });

            });

        });

        describe('when input is event time with repeatable periodicity', () => {

            describe('with date set up', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startDate = new Date();
                input.endDate = new Date();

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });

            });

            describe('without date set up', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startDate = null;
                input.endDate = null;

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });

            });

        });

        describe('when input is event time with repeatable periodicity', () => {

            describe('with 8:00 AM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startTime = '8:00';
                input.startTimePeriod = 'AM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });
            });

            describe('with 9:00 AM start time and 8:00 PM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startTime = '9:00';
                input.startTimePeriod = 'AM';
                input.endTime = '8:00';
                input.endTimePeriod = 'PM';

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });
            });

            describe('with 8:00 PM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startTime = '8:00';
                input.startTimePeriod = 'PM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE);
                });
            });

            describe('with 10:00 AM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startTime = '10:00';
                input.startTimePeriod = 'AM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE);
                });
            });

            describe('with 9:00 AM start time and 9:30 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startTime = '9:00';
                input.startTimePeriod = 'AM';
                input.endTime = '9:30';
                input.endTimePeriod = 'AM';

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });
            });

            describe('with 9:30 AM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.REPEATABLE;
                input.startTime = '9:30';
                input.startTimePeriod = 'AM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE);
                });
            });

        });

        describe('when input is event time with one time periodicity and one day duration', () => {

            describe('with 8:00 AM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = input.startDate;
                input.startTime = '8:00';
                input.startTimePeriod = 'AM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });
            });

            describe('with 9:00 AM start time and 8:00 PM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = input.startDate;
                input.startTime = '9:00';
                input.startTimePeriod = 'AM';
                input.endTime = '8:00';
                input.endTimePeriod = 'PM';

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });
            });

            describe('with 8:00 PM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = input.startDate;
                input.startTime = '8:00';
                input.startTimePeriod = 'PM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE);
                });
            });

            describe('with 10:00 AM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = input.startDate;
                input.startTime = '10:00';
                input.startTimePeriod = 'AM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: false} with validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeFalsy();
                    expect(result.validationMessage).toBe(INVALID_EVENT_TIME_RANGE_ERROR_MESSAGE);
                });
            });

        });

        describe('when input is event time with one time periodicity and two days duration', () => {

            describe('with 8:00 PM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = EventDateUtils.getTomorrowDate();
                input.startTime = '8:00';
                input.startTimePeriod = 'PM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });
            });

            describe('with 10:00 AM start time and 9:00 AM end time', () => {
                const input = new EventTime();
                input.periodicity = Periodicity.ONE_TIME;
                input.startDate = new Date();
                input.endDate = EventDateUtils.getTomorrowDate();
                input.startTime = '10:00';
                input.startTimePeriod = 'AM';
                input.endTime = '9:00';
                input.endTimePeriod = 'AM';

                it('should return {isValid: true} without validation message', () => {
                    let result = EventTimeValidator.validate(input);

                    expect(result.isValid).toBeTruthy();
                    expect(result.validationMessage).toBeUndefined();
                });
            });

        });

    });

});
