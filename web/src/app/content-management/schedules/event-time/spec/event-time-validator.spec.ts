import {EventTime} from "../../models/event-time.model";
import {EMPTY_WEEK_DAYS_ERROR_MESSAGE, EventTimeValidator, INVALID_DATE_ERROR_MESSAGE} from "../event-time.validator";
import {Periodicity} from "../../../../core/enums/periodicity";

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

    });

});
