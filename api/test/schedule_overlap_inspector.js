'use strict';

const ScheduleOverlapInspector = require('../src/schedule/helpers/schedule_overlap_inspector');

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;

describe('schedule_overlap_inspector', () => {
    describe('arePeriodicalSchedulesOverlap', () => {
        it('Should return false if two schedules have different weekdays', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 9 * * MON'
            };
            let secondSchedule = {
                eventCron: '0 0 8 * * TUE',
                endEventCron: '0 0 9 * * TUE'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules have the same time period', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 9 * * MON'
            };
            let secondSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 9 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return false if two schedules have different set of weekdays', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON,TUE,WED',
                endEventCron: '0 0 9 * * MON,TUE,WED'
            };
            let secondSchedule = {
                eventCron: '0 0 8 * * THU,FRI,SAT',
                endEventCron: '0 0 9 * * THU,FRI,SAT'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules have the same time period at one common weekday in a set of weekdays', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON,TUE,WED',
                endEventCron: '0 0 9 * * MON,TUE,WED'
            };
            let secondSchedule = {
                eventCron: '0 0 8 * * MON,FRI,SAT',
                endEventCron: '0 0 9 * * MON,FRI,SAT'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return true if two schedules have the same time period at two common weekdays in a set of weekdays', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON,TUE,SAT',
                endEventCron: '0 0 9 * * MON,TUE,SAT'
            };
            let secondSchedule = {
                eventCron: '0 0 8 * * THU,TUE,SAT',
                endEventCron: '0 0 9 * * THU,TUE,SAT'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return true if two schedules have the same time period at the same set of weekdays', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON,TUE,SAT',
                endEventCron: '0 0 9 * * MON,TUE,SAT'
            };
            let secondSchedule = {
                eventCron: '0 0 8 * * MON,TUE,SAT',
                endEventCron: '0 0 9 * * MON,TUE,SAT'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return false if two schedules have different time interval at the same weekday', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 10 * * MON',
            };
            let secondSchedule = {
                eventCron: '0 0 11 * * MON',
                endEventCron: '0 0 12 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules have time overlap at the same weekday', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 10 * * MON',
            };
            let secondSchedule = {
                eventCron: '0 0 9 * * MON',
                endEventCron: '0 0 11 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return true if one schedule performs inside another one', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 11 * * MON',
            };
            let secondSchedule = {
                eventCron: '0 0 9 * * MON',
                endEventCron: '0 0 10 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return true if one schedule performs inside another one (vise versa)', () => {
            let firstSchedule = {
                eventCron: '0 0 9 * * MON',
                endEventCron: '0 0 10 * * MON',
            };
            let secondSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 11 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return false if one schedule performs just after another one', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 9 * * MON',
            };
            let secondSchedule = {
                eventCron: '0 0 9 * * MON',
                endEventCron: '0 0 10 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return false if one schedule performs just after another one during one hour', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 30 9 * * MON',
            };
            let secondSchedule = {
                eventCron: '0 30 9 * * MON',
                endEventCron: '0 0 10 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules overlap and end at the same time', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 0 10 * * MON',
            };
            let secondSchedule = {
                eventCron: '0 0 9 * * MON',
                endEventCron: '0 0 10 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return false if two schedules have different time periods during one hour', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 15 8 * * MON'
            };
            let secondSchedule = {
                eventCron: '0 30 8 * * MON',
                endEventCron: '0 0 9 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules have the same time periods during one hour', () => {
            let firstSchedule = {
                eventCron: '0 0 8 * * MON',
                endEventCron: '0 45 8 * * MON'
            };
            let secondSchedule = {
                eventCron: '0 30 8 * * MON',
                endEventCron: '0 0 9 * * MON'
            };
            let result = ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });
    });

    describe('areOneTimeSchedulesOverlap', () => {
        it('Should return false if two schedules have different dates', () => {
            let firstSchedule = {
                eventCron: '0 0 8 1 JAN * 2017',
                endEventCron: '0 0 9 1 JAN * 2017'
            };
            let secondSchedule = {
                eventCron: '0 0 8 2 JAN * 2017',
                endEventCron: '0 0 9 2 JAN * 2017'
            };
            let result = ScheduleOverlapInspector.areOneTimeSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return false if two schedules have different months', () => {
            let firstSchedule = {
                eventCron: '0 0 8 1 JAN * 2017',
                endEventCron: '0 0 9 1 JAN * 2017'
            };
            let secondSchedule = {
                eventCron: '0 0 8 1 FEB * 2017',
                endEventCron: '0 0 9 1 FEB * 2017'
            };
            let result = ScheduleOverlapInspector.areOneTimeSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return false if two schedules have different years', () => {
            let firstSchedule = {
                eventCron: '0 0 8 1 JAN * 2017',
                endEventCron: '0 0 9 1 JAN * 2017'
            };
            let secondSchedule = {
                eventCron: '0 0 8 1 JAN * 2018',
                endEventCron: '0 0 9 1 JAN * 2018'
            };
            let result = ScheduleOverlapInspector.areOneTimeSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return false if two schedules have different time during one day', () => {
            let firstSchedule = {
                eventCron: '0 0 8 1 JAN * 2017',
                endEventCron: '0 0 9 1 JAN * 2017'
            };
            let secondSchedule = {
                eventCron: '0 0 10 1 JAN * 2017',
                endEventCron: '0 0 11 1 JAN * 2017'
            };
            let result = ScheduleOverlapInspector.areOneTimeSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules have the same time during one day', () => {
            let firstSchedule = {
                eventCron: '0 0 8 1 JAN * 2017',
                endEventCron: '0 0 10 1 JAN * 2017'
            };
            let secondSchedule = {
                eventCron: '0 0 9 1 JAN * 2017',
                endEventCron: '0 0 11 1 JAN * 2017'
            };
            let result = ScheduleOverlapInspector.areOneTimeSchedulesOverlap(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });
    });
});