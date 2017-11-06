import {Periodicity} from "../../../../core/enums/periodicity";
import {EventDateUtils} from "../event-date.utils";
import {EventTimeHolder} from "../event-time.holder";
import {EventTime} from "../../models/event-time.model";
import {getShortDay, WeekDays} from "../../../../core/enums/days-of-week";

fdescribe('EventTimeHolder', () => {

    describe('init()', () => {
        it('should return instance of EventTimeHolder', () => {
            let result = EventTimeHolder.init();

            expect(result).toBeDefined();
            expect(result).toEqual(jasmine.any(EventTimeHolder));
        });
    });

    describe('after init', () => {

        describe('value()', () => {
            it('should return eventTime that is equal to default one', () => {
                let result = EventTimeHolder.init().value();
                let defaultEventTime = getDefaultEventTime();

                expect(result).toEqual(defaultEventTime);
            });
        });

        describe('getCopyOfEventTime()', () => {
           it('should return undefined', () => {
              let result = EventTimeHolder.init().getCopyOfEventTime();

              expect(result).toBeUndefined();
           });
        });

    });

    describe('saveCopyOfPropertiesState()', () => {

        let eventTimeHolder = EventTimeHolder.init();

        it('should make a copy of event time', () => {
            eventTimeHolder.saveCopyOfPropertiesState();
            let eventTime = eventTimeHolder.value();
            let copyOfEventTime = eventTimeHolder.getCopyOfEventTime();

            expect(copyOfEventTime).toEqual(eventTime);
            expect(copyOfEventTime).not.toBe(eventTime);
        });

    });

    describe('setTime()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        describe('when input is \'startTime\' and \'9:30\'', () => {
            it('should set start time to 9:30', () => {
                eventTimeHolder.setTime('startTime', '9:30');
                let value = eventTimeHolder.value();

                expect(value.startTime).toBe('9:30');
            });
        });

        describe('when input is \'endTime\' and \'9:30\'', () => {
            it('should set end time to 9:30', () => {
                eventTimeHolder.setTime('endTime', '9:30');
                let value = eventTimeHolder.value();

                expect(value.endTime).toBe('9:30');
            });
        });

    });

    describe('setPeriodicity()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        describe('when input is \'One time\'', () => {
            it('should set periodicity to One time', () => {
                eventTimeHolder.setPeriodicity(Periodicity.ONE_TIME);
                let value = eventTimeHolder.value();

                expect(value.periodicity).toBe(Periodicity.ONE_TIME);
            });
        });

        describe('when input is \'Repeatable\'', () => {
            it('should set periodicity to Repeatable', () => {
                eventTimeHolder.setPeriodicity(Periodicity.REPEATABLE);
                let value = eventTimeHolder.value();

                expect(value.periodicity).toBe(Periodicity.REPEATABLE);
            });
        });

    });

    describe('getPeriodicity()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        it('should return periodicity of the event time', () => {
            let value = eventTimeHolder.value();

            expect(eventTimeHolder.getPeriodicity()).toBe(value.periodicity);
        });

    });

    describe('setWeekDays()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        describe('when input is \'SUN,MON\'', () => {
            it('should set weekDays to SUN,MON', () => {
                let weekDays = 'SUN,MON';
                eventTimeHolder.setWeekDays(weekDays);
                let value = eventTimeHolder.value();

                expect(value.weekDays).toBe(weekDays);
            });
        });

    });

    describe('getWeekDays()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        it('should return weekDays of the event time', () => {
            let value = eventTimeHolder.value();

            expect(eventTimeHolder.getWeekDays()).toBe(value.weekDays);
        });

    });

    describe('getWeekDaysArray()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        it('should return array of weekDays of the event time', () => {
            let weekDays = 'SUN,MON,TUE';
            eventTimeHolder.setWeekDays(weekDays);

            expect(eventTimeHolder.getWeekDaysArray()).toEqual(weekDays.split(','));
        });

    });

});

function getDefaultEventTime() {
    let eventTime = new EventTime();
    eventTime.periodicity = Periodicity.ONE_TIME;
    eventTime.weekDays = getShortDay(WeekDays.SUN);
    eventTime.startDate = EventDateUtils.getTomorrowDate();
    eventTime.endDate = eventTime.startDate;
    eventTime.startTime = '8:00';
    eventTime.startTimePeriod = 'AM';
    eventTime.endTime = '1:00';
    eventTime.endTimePeriod = 'PM';
    return eventTime;
}

