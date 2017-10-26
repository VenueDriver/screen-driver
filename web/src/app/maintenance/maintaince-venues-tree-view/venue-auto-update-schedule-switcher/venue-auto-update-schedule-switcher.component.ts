import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AutoupdateSchedule} from "../../entities/autoupdate-schedule";
import {CronConvertStrategy, CustomCronParser} from "../../../core/utils/custom-cron-parser";

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

    public autoUpdateTime: { time: string, period: string } = {time: '08:00', period: 'AM'};

    @Output() change: EventEmitter<AutoupdateSchedule> = new EventEmitter<AutoupdateSchedule>();

    constructor(
    ) { }

    setUpAutoUpdateTime(): void {
        const cron = this._autoUpdateSchedule.eventTime;
        let converter: CustomCronParser = new CustomCronParser(cron, CronConvertStrategy.PERIOD_SENSITIVE);

        this.autoUpdateTime.time = converter.getTime();
        this.autoUpdateTime.period = converter.getPeriod();
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
        console.log(newSchedule);
    }

    private getTimeAsCron(): string {
        const cronConverter = new CustomCronParser
    }
}
