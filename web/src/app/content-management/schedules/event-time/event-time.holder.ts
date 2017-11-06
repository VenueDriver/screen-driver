import {Periodicity} from "../../../core/enums/periodicity";
import {EventDateUtils} from "./event-date.utils";
import {CronToDatetimeConverter} from "../../../core/utils/datetime-cron-converter/cron-to-datetime.converter";
import {DatetimeToCronConverter} from "../../../core/utils/datetime-cron-converter/datetime-cron.converter";
import {Schedule} from "../models/schedule.model";
import {EventTime} from "../models/event-time.model";

import * as _ from 'lodash';

const TIME_PERIODS = ['AM', 'PM'];
const PERIODICITY = Periodicity;

export class EventTimeHolder {

    private eventTime = new EventTime();
    private originalEventTime: EventTime;

    static init() {
        return new EventTimeHolder();
    }

    value(): EventTime {
        return this.eventTime;
    }

    saveCopyOfPropertiesState() {
        this.originalEventTime = _.clone(this.eventTime);
    }

    restorePropertiesState() {
        this.eventTime = _.clone(this.originalEventTime);
    }

    isCopyEqualToSource(): boolean {
        return _.isEqual(this.eventTime, this.originalEventTime)
    }

    setTime(field: string, time: string) {
        this.eventTime[field] = time;
    }

    setPeriodicity(periodicity: string) {
        this.eventTime.periodicity = periodicity;
    }

    getPeriodicity(): string {
        return this.eventTime.periodicity;
    }

    setDaysOfWeek(daysOfWeek: string) {
        this.eventTime.daysOfWeek = daysOfWeek;
    }

    getWeekDays(): string {
        return this.eventTime.daysOfWeek;
    }

    getWeekDaysArray(): Array<string> {
        return this.getWeekDays().split(',');
    }

    setEndDateEqualToStartDate() {
        this.eventTime.endDate = this.eventTime.startDate;
    }

    setStartDateToZeroIfItLargerThenEndDate() {
        if (this.eventTime.startDate > this.eventTime.endDate) {
            this.eventTime.startDate = null;
        }
    }

    changeTimePeriod(field) {
        if (this.eventTime[field] === TIME_PERIODS[0]) {
            this.setTime(field, TIME_PERIODS[1])
        } else {
            this.setTime(field, TIME_PERIODS[0]);
        }
    }

    setProperties(schedule: Schedule) {
        let eventTime = new EventTime();
        eventTime.periodicity = Periodicity[schedule.periodicity];
        switch (eventTime.periodicity) {
            case Periodicity.ONE_TIME:
                this.setPropertiesForOneTimeSchedule(schedule);
                break;
            case Periodicity.REPEATABLE:
                this.setPropertiesForRepeatableSchedule(schedule);
                break;
        }
    }

    setCronsForSchedule(schedule: Schedule) {
        switch (this.eventTime.periodicity) {
            case Periodicity.ONE_TIME:
                this.setCronsForOneTimeSchedule(schedule);
                break;
            case Periodicity.REPEATABLE:
                this.setCronsForRepeatableSchedule(schedule);
                break;
        }
    }

    isOneTimeEvent(): boolean {
        return this.eventTime.periodicity === PERIODICITY.ONE_TIME;
    }

    isRepeatableEvent(): boolean {
        return this.eventTime.periodicity === PERIODICITY.REPEATABLE;
    }

    private setPropertiesForOneTimeSchedule(schedule: Schedule) {
        this.eventTime.startDate = this.getDateFromCron(schedule.eventCron);
        this.setStartTimeProperties(schedule.eventCron);

        this.eventTime.endDate = this.getDateFromCron(schedule.endEventCron);
        this.setEndTimeProperties(schedule.endEventCron);
    }

    private setPropertiesForRepeatableSchedule(schedule: Schedule) {
        this.eventTime.daysOfWeek = CronToDatetimeConverter.getWeekDaysFromCron(schedule.eventCron);

        this.setStartTimeProperties(schedule.eventCron);
        this.setEndTimeProperties(schedule.endEventCron);
    }

    private setStartTimeProperties(cron: string) {
        this.eventTime.startTimePeriod = this.getTimePeriodFromCron(cron);
        this.eventTime.startTime = this.getTimeFromCron(cron);
    }

    private setEndTimeProperties(cron: string) {
        this.eventTime.endTimePeriod = this.getTimePeriodFromCron(cron);
        this.eventTime.endTime = this.getTimeFromCron(cron);
    }

    private setCronsForOneTimeSchedule(schedule: Schedule) {
        schedule.eventCron = this.convertDateAndTimeToCron(this.eventTime.startDate, this.eventTime.startTime, this.eventTime.startTimePeriod);
        schedule.endEventCron = this.convertDateAndTimeToCron(this.eventTime.endDate, this.eventTime.endTime, this.eventTime.endTimePeriod);
    }

    private convertDateAndTimeToCron(date: Date, time: string, timePeriod: string): string {
        let cron = DatetimeToCronConverter.createCronForSpecificDate(date);
        let hours = EventDateUtils.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.setTimeForCron(cron, hours, minutes);
    }

    private getDateFromCron(cron: string): Date {
        return CronToDatetimeConverter.getDateFromCron(cron);
    }

    private setCronsForRepeatableSchedule(schedule: Schedule) {
        schedule.eventCron = this.convertWeekDayAndTimeToCron(this.eventTime.daysOfWeek, this.eventTime.startTime, this.eventTime.startTimePeriod);
        schedule.endEventCron = this.convertWeekDayAndTimeToCron(this.eventTime.daysOfWeek, this.eventTime.endTime, this.eventTime.endTimePeriod);
    }

    private convertWeekDayAndTimeToCron(daysOfWeek: string, time: string, timePeriod: string) {
        let cron = DatetimeToCronConverter.createCronForDaysOfWeek(daysOfWeek);
        let hours = EventDateUtils.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.setTimeForCron(cron, hours, minutes);
    }

    private setCronsForDailySchedule(schedule: Schedule) {
        schedule.eventCron = this.convertTimeToCron(this.eventTime.startTime, this.eventTime.startTimePeriod);
        schedule.endEventCron = this.convertTimeToCron(this.eventTime.endTime, this.eventTime.endTimePeriod);
    }

    private convertTimeToCron(time: string, timePeriod: string) {
        let hours = EventDateUtils.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.createCronForDailyAction(hours, minutes);
    }

    private getTimePeriodFromCron(cron: string): string {
        let hours = CronToDatetimeConverter.getHoursFromCron(cron);
        return hours >= 12 ? 'PM' : 'AM';
    }

    private getTimeFromCron(cron: string): string {
        let hours = CronToDatetimeConverter.getHoursFromCron(cron);
        let minutes = CronToDatetimeConverter.getMinutesFromCron(cron);

        if (hours == 12) {
            return `${12}:${minutes}`;
        }
        return `${hours % 12}:${minutes}`;
    }

}
