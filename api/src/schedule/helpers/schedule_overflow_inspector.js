'use strict';

const _ = require('lodash');

module.exports = class ScheduleOverflowInspector {

    static findOverflow(schedules, updatedSchedule) {
        return _.filter(schedules, s => ScheduleOverflowInspector.areIntersect(s, updatedSchedule));
    }

    static areIntersect(firstSchedule, secondSchedule) {
        let firstInterval = {};
        firstInterval.weekdays = ScheduleOverflowInspector._getWeekdays(firstSchedule.eventCron);
        firstInterval.time = ScheduleOverflowInspector._getTime(firstSchedule.eventCron);
        firstInterval.endTime = ScheduleOverflowInspector._getTime(firstSchedule.endEventCron);

        let secondInterval = {};
        secondInterval.weekdays = ScheduleOverflowInspector._getWeekdays(secondSchedule.eventCron);
        secondInterval.time = ScheduleOverflowInspector._getTime(secondSchedule.eventCron);
        secondInterval.endTime = ScheduleOverflowInspector._getTime(secondSchedule.endEventCron);

        let duplicates = ScheduleOverflowInspector._findDuplicates(firstInterval, secondInterval);
        return duplicates.length > 0 && ScheduleOverflowInspector._areTimeIntervalsOverflow(firstInterval, secondInterval);
    }

    static _getWeekdays(cronExpression) {
        let parts = cronExpression.split(' ');
        return parts[5].split(',');
    }

    static _findDuplicates(firstInterval, secondInterval) {
        return _.filter(firstInterval.weekdays, e => _.includes(secondInterval.weekdays, e));
    }

    static _areTimeIntervalsOverflow(firstInterval, secondInterval) {
        return firstInterval.time <= secondInterval.time && firstInterval.endTime >= secondInterval.time ||
               secondInterval.time <= firstInterval.time && secondInterval.endTime >= firstInterval.time;
    }

    static _getTime(cronExpression) {
        let cronParts = cronExpression.split(' ');
        return +cronParts[2];
    }
};