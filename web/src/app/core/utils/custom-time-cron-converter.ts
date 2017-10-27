import {CronParseResult} from "./custom-cron-parser";

const EVERY_DAY_CRON_TEMPLATE = (hours, minutes) => `0 ${minutes} ${hours} * * * *`;

export class CustomTimeCronConverter {

    constructor(private input: CronParseResult | {hours: string, minutes: string, period: string}) {
    }

    get cron(): string {
        return EVERY_DAY_CRON_TEMPLATE(this.getHours(), this.getMinutes());
    }

    private getMinutes(): string {
        return this.input.minutes == '00' ? '0' : this.input.minutes;
    }

    private getHours(): string {
        let is12AM = this.input.period.toLowerCase() == 'am' && +this.input.hours == 12;

        if (is12AM) return '24';

        if (this.input.period.toLowerCase() == 'pm') {
            if (+this.input.hours < 12) {
                return `${12 + (+this.input.hours)}`;
            }
        }
        return this.input.hours;
    }
}

