import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AutoupdateSchedule} from "../../entities/autoupdate-schedule";
import {CronConvertStrategy, CustomCronParser} from "../../../core/utils/custom-cron-parser";
import {CustomTimeCronConverter} from "../../../core/utils/custom-time-cron-converter";

@Component({
    selector: 'auto-update-schedule-switcher',
    templateUrl: 'venue-auto-update-schedule-switcher.component.html',
    styleUrls: ['./venue-auto-update-schedule-switcher.component.sass']
})
export class VenueAutoUpdateScheduleSwitcherComponent {

    private _autoUpdateSchedule: AutoupdateSchedule;

    @Input('autoUpdateSchedule')
    set autoUpdateSchedule(value: AutoupdateSchedule) {
        this._autoUpdateSchedule = value;
        this.setUpAutoUpdateTime();
    }

    get autoUpdateSchedule(): AutoupdateSchedule {
        return this._autoUpdateSchedule;
    }

    public autoUpdateTime: { hours: string, minutes: string, time: string, period: string } = {time: '08:00', hours: '8', minutes: '00', period: 'AM'};

    @Output() change: EventEmitter<AutoupdateSchedule> = new EventEmitter<AutoupdateSchedule>();

    constructor(
    ) { }

    setUpAutoUpdateTime(): void {
        const cron = this._autoUpdateSchedule.eventTime;
        let converter: CustomCronParser = new CustomCronParser(cron, CronConvertStrategy.PERIOD_SENSITIVE);

        this.autoUpdateTime = converter.result();
    }

    onTimePeriodChange(period: string): void {
        this.autoUpdateTime.period = period;
        this.notifyAutoUpdateConfigChanged();
    }

    onTimeChange(time: string): void {
        this.autoUpdateTime.time = time;
        this.notifyAutoUpdateConfigChanged();
    }

    notifyAutoUpdateConfigChanged(): void {
        const newSchedule = new AutoupdateSchedule(this._autoUpdateSchedule);
        newSchedule.eventTime = this.getTimeAsCron();

        this.change.next(newSchedule);
    }

    private getTimeAsCron(): string {
        this.autoUpdateTime.hours = this.autoUpdateTime.time.split(":")[0];
        this.autoUpdateTime.minutes = this.autoUpdateTime.time.split(":")[1];
        return new CustomTimeCronConverter(this.autoUpdateTime).cron;
    }
}
