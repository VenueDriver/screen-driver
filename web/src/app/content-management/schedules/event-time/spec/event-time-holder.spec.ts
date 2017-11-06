import {Periodicity} from "../../../../core/enums/periodicity";
import {EventDateUtils} from "../event-date.utils";
import {EventTimeHolder} from "../event-time.holder";
import {EventTime} from "../../models/event-time.model";
import {getShortDay, WeekDays} from "../../../../core/enums/days-of-week";

describe('EventTimeHolder', () => {

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

    describe('setStartTime()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        describe('when input is \'9:30\'', () => {
            it('should set start time to 9:30', () => {
                eventTimeHolder.setStartTime('9:30');
                let value = eventTimeHolder.value();

                expect(value.startTime).toBe('9:30');
            });
        });

    });

    describe('setEndTime()', () => {
        let eventTimeHolder = EventTimeHolder.init();

        describe('when input is \'9:30\'', () => {
            it('should set end time to 9:30', () => {
                eventTimeHolder.setEndTime('9:30');
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

    describe('setEndDateEqualToStartDate()', () => {
        let eventTimeHolder = EventTimeHolder.init();
        eventTimeHolder.value().startDate = new Date();
        eventTimeHolder.value().endDate = EventDateUtils.getTomorrowDate();

        it('should set end date equal to start date', () => {
            eventTimeHolder.setEndDateEqualToStartDate();
            let value = eventTimeHolder.value();

            expect(value.endDate).toEqual(value.startDate);
        });
    });

    describe('setStartDateToZeroIfItLargerThenEndDate()', () => {

        describe('when start is larger then end date', () => {
            let eventTimeHolder = EventTimeHolder.init();
            eventTimeHolder.value().startDate = EventDateUtils.getTomorrowDate();
            eventTimeHolder.value().endDate = new Date();

            it('should set start date to null', () => {
                eventTimeHolder.setStartDateToZeroIfItLargerThenEndDate();
                let value = eventTimeHolder.value();

                expect(value.startDate).toBeNull();
            });
        });

        describe('when start is smaller then end date', () => {
            let eventTimeHolder = EventTimeHolder.init();
            let date = new Date();
            eventTimeHolder.value().startDate = date;
            eventTimeHolder.value().endDate = EventDateUtils.getTomorrowDate();

            it('should do nothing with start date', () => {
                eventTimeHolder.setStartDateToZeroIfItLargerThenEndDate();
                let value = eventTimeHolder.value();

                expect(value.startDate).toBe(date);
            });
        });

        describe('when start is equal end date', () => {
            let eventTimeHolder = EventTimeHolder.init();
            let date = new Date();
            eventTimeHolder.value().startDate = date;
            eventTimeHolder.value().endDate = date;

            it('should do nothing with start date', () => {
                eventTimeHolder.setStartDateToZeroIfItLargerThenEndDate();
                let value = eventTimeHolder.value();

                expect(value.startDate).toBe(date);
                expect(value.endDate).toEqual(value.startDate);
            });
        });
    });

    describe('switchStartTimePeriod()', () => {

        describe('when start time period is AM', () => {
            let eventTimeHolder = EventTimeHolder.init();
            eventTimeHolder.value().startTimePeriod = 'AM';

            it('should set startTimePeriod to PM', () => {
                eventTimeHolder.switchStartTimePeriod();
                let value = eventTimeHolder.value();

                expect(value.startTimePeriod).toBe('PM');
            });
        });

        describe('when start time period is PM', () => {
            let eventTimeHolder = EventTimeHolder.init();
            eventTimeHolder.value().startTimePeriod = 'PM';

            it('should set startTimePeriod to AM', () => {
                eventTimeHolder.switchStartTimePeriod();
                let value = eventTimeHolder.value();

                expect(value.startTimePeriod).toBe('AM');
            });
        });

    });

    describe('switchEndTimePeriod()', () => {

        describe('when end time period is AM', () => {
            let eventTimeHolder = EventTimeHolder.init();
            eventTimeHolder.value().endTimePeriod = 'AM';

            it('should set endTimePeriod to PM', () => {
                eventTimeHolder.switchEndTimePeriod();
                let value = eventTimeHolder.value();

                expect(value.endTimePeriod).toBe('PM');
            });
        });

        describe('when end time period is PM', () => {
            let eventTimeHolder = EventTimeHolder.init();
            eventTimeHolder.value().endTimePeriod = 'PM';

            it('should set endTimePeriod to AM', () => {
                eventTimeHolder.switchEndTimePeriod();
                let value = eventTimeHolder.value();

                expect(value.endTimePeriod).toBe('AM');
            });
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

