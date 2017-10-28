import {Injectable} from "@angular/core";
import {CronConvertStrategy, CustomCronParser} from "../../../core/utils/custom-cron-parser";
import {VenueScheduleTimeSelectorParams} from "./time-selector-params.interface";
import {AutoupdateSchedule} from "../../entities/autoupdate-schedule";
import {CustomTimeCronConverter} from "../../../core/utils/custom-time-cron-converter";

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

    getUpdatedConfig(old: AutoupdateSchedule, newTime: VenueScheduleTimeSelectorParams, isEnabled: boolean): AutoupdateSchedule {
        const newSchedule = new AutoupdateSchedule(old ? old : null);
        newSchedule.isEnabled = isEnabled;

        if (newTime) {
            newSchedule.eventTime = this.getTimeAsCron(newTime);
        }

        return newSchedule;
    }

    private getTimeAsCron(params: VenueScheduleTimeSelectorParams): string {
        let hours = params.time.split(":")[0];
        let minutes = params.time.split(":")[1];
        let period = params.period;
        return new CustomTimeCronConverter({hours, minutes, period}).cron;
    }
}
