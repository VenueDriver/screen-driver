import {CronToDatetimeConverter} from "./datetime-cron-converter/cron-to-datetime.converter";

export enum CronConvertStrategy {DEFAULT, PERIOD_SENSITIVE}

export interface CronParseResult {
    hours: string;
    minutes: string;
    period: string;
    time: string;
}

export class CustomCronParser {
    private hours: number;
    private minutes: string;
    private period: string;
    private convertStrategy: CronConvertStrategy;
    private periodSensitiveHours: number;

    constructor(private cron: string, convertStrategy: CronConvertStrategy) {
        this.convertStrategy = convertStrategy ? convertStrategy : CronConvertStrategy.DEFAULT;
        let cronHours = CronToDatetimeConverter.getHoursFromCron(this.cron);
        this.setPeriod(cronHours);
        this.setHours(cronHours);
        this.minutes = CronToDatetimeConverter.getMinutesFromCron(this.cron);
        this.setPeriodSensitiveHours();
    }

    public getHours(): string {
        switch (this.convertStrategy) {
            case CronConvertStrategy.DEFAULT:
                return `${this.hours}`;
            case CronConvertStrategy.PERIOD_SENSITIVE:
                return `${this.periodSensitiveHours}`;
        }
    }

    public getMinutes(): string {
        return this.minutes;
    }

    public getPeriod(): string {
        return this.period;
    }

    public getTime(): string {
        return `${this.getHours()}:${this.getMinutes()}`;
    }

    public result(): CronParseResult {
        return {
            hours: this.getHours(),
            minutes: this.getMinutes(),
            period: this.getPeriod(),
            time: this.getTime()
        }
    }

    private setHours(cronHours: number): void {
        let is12AM = cronHours == 0;
        this.hours =  is12AM ? 12 : cronHours;
    }

    private setPeriodSensitiveHours(): void {
        this.periodSensitiveHours = this.hours > 12 ? this.hours - 12 : this.hours;
    }

    private setPeriod(hours: number): void {
        let is12AM = this.hours == 0;
        if (is12AM) {
            this.period = 'AM';
            return;
        }
        this.period = hours >= 12 && hours < 24 ? 'PM' : 'AM';
    }
}
