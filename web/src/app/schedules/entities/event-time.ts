import {ValidationResult} from "./validation-result";
import {Schedule} from "./schedule";
import {CronToDatetimeConverter} from '../../datetime-cron-converter/cron-to-datetime.converter';
import {Periodicity} from '../../enums/periodicity';
import {DaysOfWeek} from '../../enums/days-of-week';
import {DatetimeToCronConverter} from "../../datetime-cron-converter/datetime-cron.converter";

export class EventTime {

    periodicity = Periodicity.ONE_TIME_EVENT;
    dayOfWeek = DaysOfWeek.MON;
    startDate: Date = EventTime.getTomorrowDate();
    endDate = this.startDate;
    startTime = '8:00';
    startTimePeriod = 'AM';
    endTime = '1:00';
    endTimePeriod = 'PM';

    static getTomorrowDate(): Date {
        let today = new Date();
        return new Date(today.setDate(today.getDate() + 1));
    }

    static getHours(time: string, timePeriod: string): number {
        return EventTime.convertTimeToDate(time, timePeriod).getHours();
    }

    validate(): ValidationResult {
        if (!this.isDateValid()) {
            return {isValid: false, validationMessage: 'The start and the end date should be specified'};
        }
        if (this.startDate.getTime() === this.endDate.getTime() || this.periodicity !== Periodicity.ONE_TIME_EVENT) {
            let isTimeValid = this.isTimeValid();
            return {isValid: isTimeValid, validationMessage: isTimeValid ? '' : 'The end of the event couldn\'t be before the start'};
        }
        return {isValid: true};
    }

    setProperties(schedule: Schedule) {
        this.periodicity = Periodicity[schedule.periodicity];
        switch (this.periodicity) {
            case Periodicity.ONE_TIME_EVENT:
                this.setPropertiesForOneTimeSchedule(schedule);
                break;
            case Periodicity.WEEKLY:
                this.setPropertiesForWeeklySchedule(schedule);
                break;
            case Periodicity.DAILY:
                this.setPropertiesForDailySchedule(schedule);
                break;
        }
    }

    setCronsForSchedule(schedule: Schedule) {
        switch (this.periodicity) {
            case Periodicity.ONE_TIME_EVENT:
                this.setCronsForOneTimeSchedule(schedule);
                break;
            case Periodicity.WEEKLY:
                this.setCronsForWeeklySchedule(schedule);
                break;
            case Periodicity.DAILY:
                this.setCronsForDailySchedule(schedule);
                break;
        }
    }

    private setPropertiesForOneTimeSchedule(schedule: Schedule) {
        this.startDate = this.getDateFromCron(schedule.eventCron);
        this.setStartTimeProperties(schedule.eventCron);

        this.endDate = this.getDateFromCron(schedule.endEventCron);
        this.setEndTimeProperties(schedule.endEventCron);
    }

    private setPropertiesForWeeklySchedule(schedule: Schedule) {
        this.dayOfWeek = CronToDatetimeConverter.getWeekDayFromCron(schedule.eventCron);

        this.setStartTimeProperties(schedule.eventCron);
        this.setEndTimeProperties(schedule.endEventCron);
    }

    private setPropertiesForDailySchedule(schedule: Schedule) {
        this.setStartTimeProperties(schedule.eventCron);
        this.setEndTimeProperties(schedule.endEventCron);
    }

    private setStartTimeProperties(cron: string) {
        this.startTimePeriod = this.getTimePeriodFromCron(cron);
        this.startTime = this.getTimeFromCron(cron);
    }

    private setEndTimeProperties(cron: string) {
        this.endTimePeriod = this.getTimePeriodFromCron(cron);
        this.endTime = this.getTimeFromCron(cron);
    }

    private setCronsForOneTimeSchedule(schedule: Schedule) {
        schedule.eventCron = this.convertDateAndTimeToCron(this.startDate, this.startTime, this.startTimePeriod);
        schedule.endEventCron = this.convertDateAndTimeToCron(this.endDate, this.endTime, this.endTimePeriod);
    }

    private convertDateAndTimeToCron(date: Date, time: string, timePeriod: string): string {
        let cron = DatetimeToCronConverter.createCronForSpecificDate(date);
        let hours = EventTime.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.setTimeForCron(cron, hours, minutes);
    }

    private getDateFromCron(cron: string): Date {
        return CronToDatetimeConverter.getDateFromCron(cron);
    }

    private setCronsForWeeklySchedule(schedule: Schedule) {
        schedule.eventCron = this.convertWeekDayAndTimeToCron(this.dayOfWeek, this.startTime, this.startTimePeriod);
        schedule.endEventCron = this.convertWeekDayAndTimeToCron(this.dayOfWeek, this.endTime, this.endTimePeriod);
    }

    private convertWeekDayAndTimeToCron(dayOfWeek: string, time: string, timePeriod: string) {
        let cron = DatetimeToCronConverter.createCronForDayOfWeek(dayOfWeek);
        let hours = EventTime.getHours(time, timePeriod);
        let minutes = +time.split(':')[1];
        return DatetimeToCronConverter.setTimeForCron(cron, hours, minutes);
    }

    private setCronsForDailySchedule(schedule: Schedule) {
        schedule.eventCron = this.convertTimeToCron(this.startTime, this.startTimePeriod);
        schedule.endEventCron = this.convertTimeToCron(this.endTime, this.endTimePeriod);
    }

    private convertTimeToCron(time: string, timePeriod: string) {
        let hours = EventTime.getHours(time, timePeriod);
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
        return `${hours % 12}:${minutes}`;
    }

    private isTimeValid(): boolean {
        let startTime = EventTime.convertTimeToDate(this.startTime, this.startTimePeriod);
        let endTime = EventTime.convertTimeToDate(this.endTime, this.endTimePeriod);
        return endTime > startTime;
    }

    private isDateValid(): boolean {
        if (this.periodicity === Periodicity.ONE_TIME_EVENT) {
            return !!(this.startDate && this.endDate);
        }
        return true;
    }

    private static convertTimeToDate(time: string, timePeriod: string): Date {
        return new Date(`2000-01-01 ${time} ${timePeriod}`);
    }
}