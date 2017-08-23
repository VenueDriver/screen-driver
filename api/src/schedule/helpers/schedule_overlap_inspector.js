'use strict';

const _ = require('lodash');

module.exports = class ScheduleOverlapInspector {

    static findOverlap(schedules, updatedSchedules) {
        return _.filter(schedules, s => {
            let overlap = _.filter(updatedSchedules, schedule => ScheduleOverlapInspector.arePeriodicalSchedulesOverlap(s, schedule));
            return overlap.length > 0;
        });
    }

    static arePeriodicalSchedulesOverlap(firstSchedule, secondSchedule) {
        let firstInterval = ScheduleOverlapInspector._createIntervalForPeriodicalSchedule(firstSchedule);
        let secondInterval = ScheduleOverlapInspector._createIntervalForPeriodicalSchedule(secondSchedule);

        let duplicates = ScheduleOverlapInspector._findDuplicates(firstInterval, secondInterval);
        return duplicates.length > 0 && ScheduleOverlapInspector._areTimeIntervalsOverlap(firstInterval, secondInterval);
    }

    static _createIntervalForPeriodicalSchedule(schedule) {
        let interval = {};
        interval.weekdays = ScheduleOverlapInspector._getWeekdays(schedule.eventCron);

        let time = ScheduleOverlapInspector._getTime(schedule.eventCron);
        interval.time = ScheduleOverlapInspector._convertToDateObject(time);

        let endTime = ScheduleOverlapInspector._getTime(schedule.endEventCron);
        interval.endTime = ScheduleOverlapInspector._convertToDateObject(endTime);

        return interval;
    }

    static areOneTimeSchedulesOverlap(firstSchedule, secondSchedule) {
        let firstInterval = ScheduleOverlapInspector._createIntervalForOneTimeSchedule(firstSchedule);
        let secondInterval = ScheduleOverlapInspector._createIntervalForOneTimeSchedule(secondSchedule);

        return ScheduleOverlapInspector._areTimeIntervalsOverlap(firstInterval, secondInterval);
    }

    static _createIntervalForOneTimeSchedule(schedule) {
        let interval = {};
        let time = ScheduleOverlapInspector._getTime(schedule.eventCron);
        let date = ScheduleOverlapInspector._getDate(schedule.eventCron);
        interval.time = ScheduleOverlapInspector._convertToDateObject(time, date);

        let endTime = ScheduleOverlapInspector._getTime(schedule.endEventCron);
        let endDate = ScheduleOverlapInspector._getDate(schedule.endEventCron);
        interval.endTime = ScheduleOverlapInspector._convertToDateObject(endTime, endDate);
        return interval;
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
        let hours = +cronParts[2];
        let minutes = +cronParts[1];
        return `${hours}:${minutes}`;
    }

    static _getDate(cronExpression) {
        let cronParts = cronExpression.split(' ');
        let year = +cronParts[6];
        let month = cronParts[4];
        let dayOfMonth = +cronParts[3];
        return `${month} ${dayOfMonth}, ${year}`;
    }

    static _convertToDateObject(time, date) {
        if (_.isEmpty(date)) {
            date = '1 JAN, 2017';
        }
        return new Date(`${date} ${time}`);
    }
};