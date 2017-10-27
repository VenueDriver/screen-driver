import {Injectable} from "@angular/core";
import {CronConvertStrategy, CustomCronParser} from "../../../core/utils/custom-cron-parser";
import {VenueScheduleTimeSelectorParams} from "./time-selector-params.interface";

@Injectable()
export class VenueAutoUpdateScheduleSwitcherService {


    constructor() { }

    getTimeFromCron(cron: string): VenueScheduleTimeSelectorParams {
        let converter: CustomCronParser = new CustomCronParser(cron, CronConvertStrategy.PERIOD_SENSITIVE);
        return converter.result();
    }

    getDefaultAutoUpdateTime(): VenueScheduleTimeSelectorParams {
        return {time: '08:00', hours: '8', minutes: '00', period: 'AM'};
    }
}
