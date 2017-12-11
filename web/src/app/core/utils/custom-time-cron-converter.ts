import {CronParseResult} from "./custom-cron-parser";
import {EventDateUtils} from "../../content-management/schedules/event-time/event-date.utils";

const EVERY_DAY_CRON_TEMPLATE = (hours, minutes) => `0 ${minutes} ${hours} * * * *`;

export class CustomTimeCronConverter {

    //may be will be nice to throw exception if hours is > 12. Because we're working with 12 hours format.
    constructor(private input: CronParseResult | {hours: string, minutes: string, period: string}) {
    }

    get cron(): string {
        return EVERY_DAY_CRON_TEMPLATE(this.getHours(), this.getMinutes());
    }

    private getMinutes(): string {
        let minutes = this.input.minutes;
        if (minutes === '0') return minutes;
        return minutes.startsWith('0') ? minutes.slice(1) : minutes;
    }

    private getHours(): number {
        let time = `${this.input.hours}:${this.input.minutes}`;
        return EventDateUtils.getHours(time, this.input.period);
    }
}

