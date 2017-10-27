import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AutoupdateSchedule} from "../../entities/autoupdate-schedule";
import {CustomTimeCronConverter} from "../../../core/utils/custom-time-cron-converter";
import {VenueAutoUpdateScheduleSwitcherService} from "./venue-auto-update-schedule-switcher.service";

@Component({
    selector: 'auto-update-schedule-switcher',
    templateUrl: 'venue-auto-update-schedule-switcher.component.html',
    styleUrls: ['./venue-auto-update-schedule-switcher.component.sass'],
    providers: [VenueAutoUpdateScheduleSwitcherService]
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

    @Output() autoUpdateChange: EventEmitter<AutoupdateSchedule> = new EventEmitter<AutoupdateSchedule>();

    constructor(private service: VenueAutoUpdateScheduleSwitcherService) { }

    setUpAutoUpdateTime(): void {
        const cron = this._autoUpdateSchedule.eventTime;
        this.autoUpdateTime = this.service.getTimeFromCron(cron);
    }

    onTimePeriodChange(period: string): void {
        this.autoUpdateTime.period = period;
        this.notifyAutoUpdateConfigChanged();
    }

    onTimeChange(time: string): void {
        this.autoUpdateTime.time = time;
        this.notifyAutoUpdateConfigChanged();
    }

    onEnabledChange(isEnabled): void {
        const newSchedule = new AutoupdateSchedule(this._autoUpdateSchedule);
        newSchedule.isEnabled = isEnabled;
        this._autoUpdateSchedule.isEnabled = isEnabled;
        this.autoUpdateChange.next(newSchedule);
    }

    notifyAutoUpdateConfigChanged(): void {
        const newSchedule = new AutoupdateSchedule(this._autoUpdateSchedule);
        newSchedule.eventTime = this.getTimeAsCron();

        this.autoUpdateChange.next(newSchedule);
    }

    get isEnabled(): boolean {
        return this._autoUpdateSchedule.isEnabled;
    }

    get isTimeSelectDisabled(): boolean {
        return !this.isEnabled;
    }

    private getTimeAsCron(): string {
        this.autoUpdateTime.hours = this.autoUpdateTime.time.split(":")[0];
        this.autoUpdateTime.minutes = this.autoUpdateTime.time.split(":")[1];
        return new CustomTimeCronConverter(this.autoUpdateTime).cron;
    }
}
