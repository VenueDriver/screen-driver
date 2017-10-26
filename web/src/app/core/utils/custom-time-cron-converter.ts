import {CronParseResult} from "./custom-cron-parser";

const EVERY_DAY_CRON_TEMPLATE = (hours, minutes) => `0 ${minutes} ${hours} * * * *`;

export class CustomTimeCronConverter {

    constructor(private input: CronParseResult) {
    }

    get cron(): string {
        return EVERY_DAY_CRON_TEMPLATE(this.getHours(), this.getMinutes());
    }

    private getMinutes(): string {
        return this.input.minutes == '00' ? '0' : this.input.minutes;
    }

    private getHours(): string {
        if (this.input.period.toLowerCase() == 'pm') {
            if (+this.input.hours < 13) {
                return `${12 + (+this.input.hours)}`;
            }
        }
        return this.input.hours;
    }
}

