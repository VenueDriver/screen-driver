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
    });
});