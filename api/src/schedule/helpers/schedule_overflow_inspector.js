'use strict';

const _ = require('lodash');

module.exports = class ScheduleOverflowInspector {

    static areIntersect(firstSchedule, secondSchedule) {
        let firstWeekdays = ScheduleOverflowInspector._getWeekdays(firstSchedule.eventCron);
        let secondWeekdays = ScheduleOverflowInspector._getWeekdays(secondSchedule.eventCron);
        let duplicates = ScheduleOverflowInspector._findDuplicates(firstWeekdays, secondWeekdays);
        return duplicates.length > 0;
    }

    static _getWeekdays(cronExpression) {
        let parts = cronExpression.split(' ');
        return parts[5].split(',');
    }

    static _findDuplicates(firstArray, secondArray) {
        return _.filter(firstArray, e => _.includes(secondArray, e));
    }
};