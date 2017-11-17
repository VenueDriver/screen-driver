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

    public autoUpdateTimeSchedule: VenueScheduleTimeSelectorParams;
    private _originalAutoUpdateSchedule: VenueScheduleTimeSelectorParams;
    private _autoUpdateSchedule: AutoupdateSchedule;
    private _scheduleChanged = false;

    @Input('autoUpdateSchedule')
    set autoUpdateSchedule(value: AutoupdateSchedule) {
        this._autoUpdateSchedule = value;
        this.setUpAutoUpdateTimeSchedule();
    }

    get autoUpdateSchedule(): AutoupdateSchedule {
        return this._autoUpdateSchedule;
    }

    @Output()
    scheduleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    scheduleUpdate: EventEmitter<AutoupdateSchedule> = new EventEmitter<AutoupdateSchedule>();

    constructor(private service: VenueAutoUpdateScheduleSwitcherService) {
        this.autoUpdateTimeSchedule = this.service.getDefaultAutoUpdateTime();
    }

    setUpAutoUpdateTimeSchedule(): void {
        const cron = this._autoUpdateSchedule.eventTime;
        this.autoUpdateTimeSchedule = this.service.getTimeFromCron(cron);
        this.saveCopyOfAutoUpdateSchedule();
    }

    onTimePeriodChange(period: string): void {
        this.autoUpdateTimeSchedule.period = period;
        this.compareAutoUpdateTimeWithSource();
        this.notifyScheduleConfigChanged();
    }

    onTimeChange(time: string): void {
        this.autoUpdateTimeSchedule.time = time;
        this.compareAutoUpdateTimeWithSource();
        this.notifyScheduleConfigChanged();
    }

    onEnabledChange(isEnabled): void {
        this._autoUpdateSchedule.isEnabled = isEnabled;
        this.notifyScheduleConfigUpdated();
    }

    notifyScheduleConfigUpdated(): void {
        this.scheduleUpdate.next(this.configToUpdate());
    }

    notifyScheduleConfigChanged(): void {
        this.scheduleChange.next(this._scheduleChanged);
    }

    configToUpdate(): AutoupdateSchedule {
        return this.service.getUpdatedConfig(this._autoUpdateSchedule, this.autoUpdateTimeSchedule, this.isEnabled);
    }

    get isEnabled(): boolean {
        return this._autoUpdateSchedule.isEnabled;
    }

    get isTimeSelectDisabled(): boolean {
        return !this.isEnabled;
    }

    performSubmit(event: any) {
        event.stopPropagation();
        this.notifyScheduleConfigUpdated();
        this._scheduleChanged = false;
        this.notifyScheduleConfigChanged();
    }

    performCancel(event: any) {
        event.stopPropagation();
        this.discardChanges();
        this._scheduleChanged = false;
        this.notifyScheduleConfigChanged();
    }

    compareAutoUpdateTimeWithSource() {
        this._scheduleChanged = !_.isEqual(this.autoUpdateTimeSchedule, this._originalAutoUpdateSchedule);
    }

    saveCopyOfAutoUpdateSchedule() {
        this._originalAutoUpdateSchedule = _.cloneDeep(this.autoUpdateTimeSchedule);
    }

    discardChanges() {
        this.autoUpdateTimeSchedule = _.cloneDeep(this._originalAutoUpdateSchedule);
    }

}
