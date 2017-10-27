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

    static createCronForDaysOfWeek(daysOfWeek: string): string {
        return `* * * * * ${daysOfWeek}`;
    }

    static setTimeForCron(cron: string, hour: number, minute: number): string {
        let cronDate = cron.substr(6);
        return `0 ${minute} ${hour} ${cronDate}`;
    }

    static createCronForDailyAction(hour: number, minute: number): string {
        return `0 ${minute} ${hour} * * *`;
    }
}