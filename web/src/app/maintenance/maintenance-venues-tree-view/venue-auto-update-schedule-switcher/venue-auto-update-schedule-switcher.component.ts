import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AutoupdateSchedule} from "../../entities/autoupdate-schedule";
import {VenueAutoUpdateScheduleSwitcherService} from "./venue-auto-update-schedule-switcher.service";
import {VenueScheduleTimeSelectorParams} from "./time-selector-params.interface";

@Component({
    selector: 'auto-update-schedule-switcher',
    templateUrl: 'venue-auto-update-schedule-switcher.component.html',
    styleUrls: ['./venue-auto-update-schedule-switcher.component.sass'],
    providers: [VenueAutoUpdateScheduleSwitcherService]
})
export class VenueAutoUpdateScheduleSwitcherComponent {
    public autoUpdateTime: VenueScheduleTimeSelectorParams;
    private _autoUpdateSchedule: AutoupdateSchedule;

    @Input('autoUpdateSchedule')
    set autoUpdateSchedule(value: AutoupdateSchedule) {
        this._autoUpdateSchedule = value;
        this.setUpAutoUpdateTime();
    }

    get autoUpdateSchedule(): AutoupdateSchedule {
        return this._autoUpdateSchedule;
    }

    @Output() autoUpdateChange: EventEmitter<AutoupdateSchedule> = new EventEmitter<AutoupdateSchedule>();

    constructor(private service: VenueAutoUpdateScheduleSwitcherService) {
        this.autoUpdateTime = this.service.getDefaultAutoUpdateTime();
    }

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
        this._autoUpdateSchedule.isEnabled = isEnabled;
        this.notifyAutoUpdateConfigChanged();
    }

    notifyAutoUpdateConfigChanged(): void {
        this.autoUpdateChange.next(this.configToUpdate());
    }

    configToUpdate(): AutoupdateSchedule {
        return this.service.getUpdatedConfig(this._autoUpdateSchedule, this.autoUpdateTime, this.isEnabled);
    }

    get isEnabled(): boolean {
        return this._autoUpdateSchedule.isEnabled;
    }

    get isTimeSelectDisabled(): boolean {
        return !this.isEnabled;
    }
}
