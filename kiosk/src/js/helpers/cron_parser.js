'use strict';

module.exports = class CronParser {

    static parseEndEventCron(schedule) {
        return CronParser._parseEventCron(schedule, 'endEventCron');
    }

    static parseStartEventCron(schedule) {
        return CronParser._parseEventCron(schedule, 'eventCron');
    }

    static _parseEventCron(schedule, field) {
        switch (schedule.periodicity) {
            case 'ONE_TIME': return CronParser.getDateTimeForOneTimeSchedule(schedule[field]);
            case 'REPEATABLE': return CronParser.getDateTimeForRepeatableSchedule(schedule[field]);
        }
    }

    static getDateTimeForOneTimeSchedule(cron) {
        let date = CronParser.getDateFromCron(cron);
        let hours = CronParser.getHoursFromCron(cron);
        let minutes = CronParser.getMinutesFromCron(cron);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    }

    static getDateTimeForRepeatableSchedule(cron) {
        let date = new Date();
        let hours = CronParser.getHoursFromCron(cron);
        let minutes = CronParser.getMinutesFromCron(cron);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    }

    static getDateFromCron(cron) {
        if (!cron) {
            return new Date();
        }
        let parts = cron.split(' ');
        let year = +parts[6];
        let month = parts[4];
        let dayOfMonth = +parts[3];
        return new Date(`${month} ${dayOfMonth}, ${year}`);
    }

    static getMinutesFromCron(cron) {
        if (!cron) {
            return '';
        }
        let parts = cron.split(' ');
        let minutes = parts[1];
        return +minutes < 10 ? `0${minutes}` : minutes;
    }

    static getHoursFromCron(cron) {
        if (!cron) {
            return 0;
        }
        let parts = cron.split(' ');
        return +parts[2];
    }

    static convertWeekDaysToNumbers(schedule) {
        var shortWeekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        var expressions = schedule.eventCron.split(' ');
        expressions = appendSeccondExpression(expressions);
        let daysOfWeek = expressions[5].split(',');

        let numbers = daysOfWeek.map(dayOfWeek => shortWeekDays.indexOf(dayOfWeek.substring(0,3).toLowerCase()));
        return numbers;


        function appendSeccondExpression(expressions) {
            if (expressions.length === 5) {
                return ['0'].concat(expressions);
            }
            return expressions;
        }
    }
};