import {getShortDay} from "../enums/days-of-week";

export class DatetimeToCronConverter {

    static createCronForSpecificDate(date: Date): string {
        let dayOfMonth = date.getDate();
        let month = date.toLocaleString('en-us', { month: "short" }).toUpperCase();
        let year = date.getFullYear();
        return `0 0 0 ${dayOfMonth} ${month} * ${year}`;
    }

    static addOneDay(date: Date): Date {
        return new Date(date.setDate(date.getDate() + 1));
    }

    static createCronForDayOfWeek(dayOfWeek: string): string {
        let day = getShortDay(dayOfWeek);
        return `* * * * * ${day}`;
    }

    static setTimeForCron(cron: string, hour: number, minute: number): string {
        let cronDate = cron.substr(6);
        return `0 ${minute} ${hour} ${cronDate}`;
    }

}