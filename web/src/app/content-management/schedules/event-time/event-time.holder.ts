import {Periodicity} from "../../../core/enums/periodicity";
import {EventDateUtils} from "./event-date.utils";
import {CronToDatetimeConverter} from "../../../core/utils/datetime-cron-converter/cron-to-datetime.converter";
import {DatetimeToCronConverter} from "../../../core/utils/datetime-cron-converter/datetime-cron.converter";
import {Schedule} from "../models/schedule.model";
import {EventTime} from "../models/event-time.model";
import {CronConvertStrategy, CronParseResult, CustomCronParser} from "../../../core/utils/custom-cron-parser";

import * as _ from 'lodash';

const TIME_PERIODS = ['AM', 'PM'];

export class EventTimeHolder {

    private eventTime = new EventTime();
    private copyOfEventTime: EventTime;

    static init() {
        return new EventTimeHolder();
    }

    value(): EventTime {
        return this.eventTime;
    }

    getCopyOfEventTime() {
        return this.copyOfEventTime;
    }

    saveCopyOfPropertiesState() {
        this.copyOfEventTime = _.clone(this.eventTime);
    }

    restorePropertiesState() {
        this.eventTime = _.clone(this.copyOfEventTime);
    }

    isCopyEqualToSource(): boolean {
        return _.isEqual(this.eventTime, this.copyOfEventTime)
    }

    setStartTime(time: string) {
        this.eventTime.startTime = time;
    }

    setEndTime(time: string) {
        this.eventTime.endTime = time;
    }

    setPeriodicity(periodicity: string) {
        this.eventTime.periodicity = periodicity;
    }

    getPeriodicity(): string {
        return this.eventTime.periodicity;
    }

    setWeekDays(weekDays: string) {
        this.eventTime.weekDays = weekDays;
    }

    getWeekDays(): string {
        return this.eventTime.weekDays;
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

    switchStartTimePeriod() {
        let period = this.eventTime.startTimePeriod;
        this.eventTime.startTimePeriod = this.getOppositePeriod(period);
    }

    switchEndTimePeriod() {
        let period = this.eventTime.endTimePeriod;
        this.eventTime.endTimePeriod = this.getOppositePeriod(period);
    }

    setProperties(schedule: Schedule) {
        this.eventTime.periodicity = schedule.periodicity;
        switch (this.eventTime.periodicity) {
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
        return this.eventTime.periodicity === Periodicity.ONE_TIME;
    }

    isRepeatableEvent(): boolean {
        return this.eventTime.periodicity === Periodicity.REPEATABLE;
    }

    private getOppositePeriod(period: string): string {
        return period === TIME_PERIODS[0] ? TIME_PERIODS[1] : TIME_PERIODS[0];
    }

    private setPropertiesForOneTimeSchedule(schedule: Schedule) {
        this.eventTime.startDate = this.getDateFromCron(schedule.eventCron);
        this.eventTime.endDate = this.getDateFromCron(schedule.endEventCron);
        this.setEventTimeDetails(schedule);
    }

    private setPropertiesForRepeatableSchedule(schedule: Schedule) {
        this.eventTime.weekDays = CronToDatetimeConverter.getWeekDaysFromCron(schedule.eventCron);
        this.setEventTimeDetails(schedule);
    }

    private setEventTimeDetails(schedule: Schedule) {
        let eventStartDetails = this.getEventDetailsFromCron(schedule.eventCron);
        this.eventTime.startTime = eventStartDetails.time;
        this.eventTime.startTimePeriod = eventStartDetails.period;

        let eventEndDetails = this.getEventDetailsFromCron(schedule.endEventCron);
        this.eventTime.endTime = eventEndDetails.time;
        this.eventTime.endTimePeriod = eventEndDetails.period;
    }

    private getEventDetailsFromCron(cron: string): CronParseResult {
        return new CustomCronParser(cron, CronConvertStrategy.PERIOD_SENSITIVE).result();
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
        schedule.eventCron = this.convertWeekDayAndTimeToCron(this.eventTime.weekDays, this.eventTime.startTime, this.eventTime.startTimePeriod);
        schedule.endEventCron = this.convertWeekDayAndTimeToCron(this.eventTime.weekDays, this.eventTime.endTime, this.eventTime.endTimePeriod);
    }

    private convertWeekDayAndTimeToCron(daysOfWeek: string, time: string, timePeriod: string) {
        let cron = DatetimeToCronConverter.createCronForDaysOfWeek(daysOfWeek);
        let hours = EventDateUtils.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.setTimeForCron(cron, hours, minutes);
    }

}
