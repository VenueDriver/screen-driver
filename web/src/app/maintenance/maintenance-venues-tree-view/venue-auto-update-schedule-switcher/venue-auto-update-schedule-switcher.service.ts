import {Injectable} from "@angular/core";
import {CronConvertStrategy, CustomCronParser} from "../../../core/utils/custom-cron-parser";

type TimeSelector = {hours: string; minutes: string; period: string; time: string; }

@Injectable()
export class VenueAutoUpdateScheduleSwitcherService {


    constructor() { }

    getTimeFromCron(cron: string): TimeSelector {
        let converter: CustomCronParser = new CustomCronParser(cron, CronConvertStrategy.PERIOD_SENSITIVE);
        return converter.result();
    }
}
