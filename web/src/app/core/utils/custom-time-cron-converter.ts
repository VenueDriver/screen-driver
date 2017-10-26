import {CronParseResult} from "./custom-cron-parser";

const HOURS_MAP = {1: 13, 2: 14, 3: 15, 4: 16, 5: 17, 6: 18, 7: 19, 8: 20, 9: 21, 10: 22, 11: 23, 12: 24};

const EVERY_DAY_CRONE_TEMPLATE = (hours, minutes) => `0 ${minutes} ${hours} * * * *`;

export class CustomTimeCronConverter {

    constructor(private input: CronParseResult) {
    }

    get cron(): string {
        return EVERY_DAY_CRONE_TEMPLATE(this.getHours(), this.getMinutes());
    }

    private getMinutes(): string {
        return this.input.minutes == '00' ? '0' : this.input.minutes;
    }

    private getHours(): string {
        if (this.input.period.toLowerCase() == 'pm') {
            if (+this.input.hours < 13) {
                return HOURS_MAP[this.input.hours];
            }
        }
        return this.input.hours;
    }
}

