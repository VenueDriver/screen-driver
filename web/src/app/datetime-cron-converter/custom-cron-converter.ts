import {CronToDatetimeConverter} from "./cron-to-datetime.converter";

export enum CronConvertStrategy {DEFAULT, PERIOD_SENSITIVE}

export interface CronConvertResult {
    hours: string;
    minutes: string;
    period: string;
}

const HOURS_MAP = {24: 12, 23: 11, 22: 10, 21: 9, 20: 8, 19: 7, 18: 6, 17: 5, 16: 4, 15: 3, 14: 2, 13: 1};

export class CustomCronConverter {
    private hours: number;
    private minutes: string;
    private period: string;
    private convertStrategy: CronConvertStrategy;
    private periodSensitiveHours: number;

    constructor(private cron: string, convertStrategy: CronConvertStrategy) {
        this.convertStrategy = convertStrategy ? convertStrategy : CronConvertStrategy.DEFAULT;

        this.hours = CronToDatetimeConverter.getHoursFromCron(this.cron);
        this.minutes = CronToDatetimeConverter.getMinutesFromCron(this.cron);

        this.setPeriod(this.hours);
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

    public result(): CronConvertResult {
        return {
            hours: this.getHours(),
            minutes: this.getMinutes(),
            period: this.getPeriod()
        }
    }

    private setPeriodSensitiveHours(): void {
        this.periodSensitiveHours = this.hours > 12 ? HOURS_MAP[this.hours] : this.hours;
    }

    private setPeriod(hours: number): void {
        this.period = hours >= 12 ? 'PM' : 'AM';
    }
}
