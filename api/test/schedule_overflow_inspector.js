'use strict';

const ScheduleOverflowInspector = require('../src/schedule/helpers/schedule_overflow_inspector');

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;

describe('schedule_overflow_inspector', () => {
    describe('areIntersect', () => {
        it('Should return false if two schedules have different weekdays', () => {
            let firstSchedule = {eventCron: '0 0 8 * * MON'};
            let secondSchedule = {eventCron: '0 0 9 * * TUE'};
            let result = ScheduleOverflowInspector.areIntersect(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules have the same weekday', () => {
            let firstSchedule = {eventCron: '0 0 8 * * MON'};
            let secondSchedule = {eventCron: '0 0 9 * * MON'};
            let result = ScheduleOverflowInspector.areIntersect(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return false if two schedules have different set of weekdays', () => {
            let firstSchedule = {eventCron: '0 0 8 * * MON,TUE,WED'};
            let secondSchedule = {eventCron: '0 0 9 * * THU,FRI,SAT'};
            let result = ScheduleOverflowInspector.areIntersect(firstSchedule, secondSchedule);

            expect(result).to.equal(false);
        });

        it('Should return true if two schedules have one common weekday in a set of weekdays', () => {
            let firstSchedule = {eventCron: '0 0 8 * * MON,TUE,WED'};
            let secondSchedule = {eventCron: '0 0 9 * * THU,TUE,SAT'};
            let result = ScheduleOverflowInspector.areIntersect(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return true if two schedules have two common weekdays in a set of weekdays', () => {
            let firstSchedule = {eventCron: '0 0 8 * * MON,TUE,SAT'};
            let secondSchedule = {eventCron: '0 0 9 * * THU,TUE,SAT'};
            let result = ScheduleOverflowInspector.areIntersect(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });

        it('Should return true if two schedules have the same set of weekdays', () => {
            let firstSchedule = {eventCron: '0 0 8 * * MON,TUE,SAT'};
            let secondSchedule = {eventCron: '0 0 9 * * MON,TUE,SAT'};
            let result = ScheduleOverflowInspector.areIntersect(firstSchedule, secondSchedule);

            expect(result).to.equal(true);
        });
    });
});