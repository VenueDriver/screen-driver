'use strict';

const _ = require('lodash');

module.exports = class ScheduleOverlapInspector {

    static findOverlap(schedules, updatedSchedules) {
        return _.filter(updatedSchedules, s => {
            let overlap = _.filter(schedules, schedule => ScheduleOverlapInspector.areOverlap(s, schedule));
            return overlap.length > 0;
        });
    }

    static areOverlap(firstSchedule, secondSchedule) {
        let firstInterval = {};
        firstInterval.weekdays = ScheduleOverlapInspector._getWeekdays(firstSchedule.eventCron);
        firstInterval.time = ScheduleOverlapInspector._getTime(firstSchedule.eventCron);
        firstInterval.endTime = ScheduleOverlapInspector._getTime(firstSchedule.endEventCron);

        let secondInterval = {};
        secondInterval.weekdays = ScheduleOverlapInspector._getWeekdays(secondSchedule.eventCron);
        secondInterval.time = ScheduleOverlapInspector._getTime(secondSchedule.eventCron);
        secondInterval.endTime = ScheduleOverlapInspector._getTime(secondSchedule.endEventCron);

        let duplicates = ScheduleOverlapInspector._findDuplicates(firstInterval, secondInterval);
        return duplicates.length > 0 && ScheduleOverlapInspector._areTimeIntervalsOverlap(firstInterval, secondInterval);
    }

    static _getWeekdays(cronExpression) {
        let parts = cronExpression.split(' ');
        return parts[5].split(',');
    }

    static _findDuplicates(firstInterval, secondInterval) {
        return _.filter(firstInterval.weekdays, e => _.includes(secondInterval.weekdays, e));
    }

    static _areTimeIntervalsOverlap(firstInterval, secondInterval) {
        return firstInterval.time <= secondInterval.time && firstInterval.endTime > secondInterval.time ||
               secondInterval.time <= firstInterval.time && secondInterval.endTime > firstInterval.time;
    }

    static _getTime(cronExpression) {
        let cronParts = cronExpression.split(' ');
        return +cronParts[2];
    }
};