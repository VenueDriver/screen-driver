import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AutoupdateSchedule} from "../../entities/autoupdate-schedule";
import {VenueAutoUpdateScheduleSwitcherService} from "./venue-auto-update-schedule-switcher.service";
import {VenueScheduleTimeSelectorParams} from "./time-selector-params.interface";

import * as _ from 'lodash';

@Component({
    selector: 'auto-update-schedule-switcher',
    templateUrl: 'venue-auto-update-schedule-switcher.component.html',
    styleUrls: ['./venue-auto-update-schedule-switcher.component.sass'],
    providers: [VenueAutoUpdateScheduleSwitcherService]
})
export class VenueAutoUpdateScheduleSwitcherComponent {

    public autoUpdateTime: VenueScheduleTimeSelectorParams;
    private _originalAutoUpdateTime: VenueScheduleTimeSelectorParams;
    private _autoUpdateSchedule: AutoupdateSchedule;
    private _timeChanged = false;

    @Input('autoUpdateSchedule')
    set autoUpdateSchedule(value: AutoupdateSchedule) {
        this._autoUpdateSchedule = value;
        this.setUpAutoUpdateTime();
    }

    get autoUpdateSchedule(): AutoupdateSchedule {
        return this._autoUpdateSchedule;
    }

    @Output()
    autoUpdateChange: EventEmitter<AutoupdateSchedule> = new EventEmitter<AutoupdateSchedule>();

    constructor(private service: VenueAutoUpdateScheduleSwitcherService) {
        this.autoUpdateTime = this.service.getDefaultAutoUpdateTime();
    }

    setUpAutoUpdateTime(): void {
        const cron = this._autoUpdateSchedule.eventTime;
        this.autoUpdateTime = this.service.getTimeFromCron(cron);
        this._originalAutoUpdateTime = _.cloneDeep(this.autoUpdateTime);
    }

    onTimePeriodChange(period: string): void {
        this.autoUpdateTime.period = period;
        this.isCopyEqualToSource();
    }

    onTimeChange(time: string): void {
        this.autoUpdateTime.time = time;
        this.isCopyEqualToSource();
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

    performSubmit() {
        event.stopPropagation();
        this._timeChanged = false;
        this.notifyAutoUpdateConfigChanged();
    }

    performCancel(event: any) {
        event.stopPropagation();
        this.autoUpdateTime = _.cloneDeep(this._originalAutoUpdateTime);
        this._timeChanged = false;
    }

    isCopyEqualToSource() {
        this._timeChanged = !_.isEqual(this.autoUpdateTime, this._originalAutoUpdateTime);
    }

}
