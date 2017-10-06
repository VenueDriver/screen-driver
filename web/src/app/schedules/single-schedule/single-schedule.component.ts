import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SchedulesService} from "../schedules.service";
import {Schedule} from "../entities/schedule";
import {EventTime} from "../entities/event-time";
import {SettingStateHolderService} from "../../settings/setting-state-manager/settings-state-holder.service";
import {Setting} from "../../settings/entities/setting";
import {ValidationResult} from "../entities/validation-result";
import {Periodicity} from '../../enums/periodicity';
import {DaysOfWeek} from '../../enums/days-of-week';

import * as _ from 'lodash';
import {PriorityTypes} from "../../enums/priorty-types";

@Component({
    selector: 'single-schedule',
    templateUrl: 'single-schedule.component.html',
    styleUrls: ['single-schedule.component.sass']
})
export class SingleScheduleComponent implements OnInit {

    @Input() schedule: Schedule;
    @Input() editable = true;
    @Input() currentSetting: Setting;

    @Output() cancel = new EventEmitter();

    removingMode = false;
    eventTime = new EventTime();
    originalEventTime: EventTime;

    timeItems: Array<string> = [];
    timePeriods = ['AM', 'PM'];

    validationResult: ValidationResult = {isValid: true};

    scheduleTypes = Periodicity;

    daysOfWeek = DaysOfWeek;

    constructor(
        private schedulesService: SchedulesService,
        private settingStateHolderService: SettingStateHolderService
    ) {
        this.generateTimeItems();
    }

    ngOnInit() {
        this.subscribeToCurrentSettingUpdate();
        this.subscribeToScheduleListUpdate();
        this.setEventTimeProperties();
        this.initPeriodicity();
    }

    initPeriodicity() {
        if (this.currentSetting) {
            switch (this.currentSetting.priority) {
                case (PriorityTypes.PERSISTENT.id):
                    this.setScheduleType();
                    break;
                case (PriorityTypes.PERIODICAL.id):
                    this.setScheduleType(Periodicity.REPEATABLE);
                    break;
                case (PriorityTypes.OCCASIONAL.id):
                    this.setScheduleType(Periodicity.ONE_TIME);
                    break;
            }
        }
    }

    generateTimeItems() {
        this.timeItems.push(`${12}:00`, `${12}:15`, `${12}:30`, `${12}:45`);
        for (let i = 1; i < 12; i++) {
            this.timeItems.push(`${i}:00`, `${i}:15`, `${i}:30`, `${i}:45`);
        }
    }

    subscribeToCurrentSettingUpdate() {
        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => {
                this.currentSetting = setting;
                this.initPeriodicity();
            });
    }

    subscribeToScheduleListUpdate() {
        this.schedulesService.scheduleListUpdated
            .subscribe(() => this.eventTime = new EventTime());
    }

    setEventTimeProperties() {
        if (!_.isEmpty(this.schedule)) {
            this.eventTime.setProperties(this.schedule);
            this.originalEventTime = _.clone(this.eventTime);
        }
    }

    setTime(field: string, time: string) {
        this.eventTime[field] = time;
        this.validate();
    }

    validate() {
        this.validationResult = this.eventTime.validate();
    }

    performCreatingSubmit() {
        this.schedulesService.createSchedule(this.currentSetting, this.eventTime);
    }

    onStartDateSelect() {
        this.eventTime.endDate = this.eventTime.startDate;
        this.validate();
    }

    onEndDateSelect() {
        if (this.eventTime.startDate > this.eventTime.endDate) {
            this.eventTime.startDate = null;
        }
        this.validate();
    }

    isCreationMode(): boolean {
        return _.isEmpty(this.schedule);
    }

    isEditMode(): boolean {
        return !this.isCreationMode()
            && !this.removingMode
            && !_.isEqual(this.eventTime, this.originalEventTime);
    }

    performUpdatingSubmit() {
        this.schedulesService.updateSchedule(this.schedule, this.eventTime);
    }

    performCancel() {
        if (this.isCreationMode()) {
            this.cancel.emit();
        } else {
            this.eventTime = _.clone(this.originalEventTime);
            this.validationResult = {isValid: true};
        }
    }

    setScheduleType(scheduleType?: string) {
        this.eventTime.periodicity = scheduleType;
        this.validate();
    }

    setDaysOfWeek(daysOfWeek: Array<string>) {
        this.eventTime.daysOfWeek = daysOfWeek.join(',');
        this.validate();
    }

    changeScheduleState(state: boolean) {
        this.schedule.enabled = state;
        this.schedulesService.updateSchedule(this.schedule);
    }

    setRemovingMode(boolean: boolean) {
        this.removingMode = boolean;
    }

    removeSchedule() {
        this.schedulesService.removeSchedule(this.schedule);
    }

    getDaysOfWeek(): Array<string> {
        return this.eventTime.daysOfWeek.split(',');
    }

    toggleWeek() {
        this.isWeekSelected() ? this.unSelectWeek() : this.selectWeek();
    }

    selectWeek() {
       let allDays = Object.keys(DaysOfWeek);
       this.eventTime.daysOfWeek = allDays.join(',');

       this.validate();
    }

    unSelectWeek() {
        this.eventTime.daysOfWeek = "";

        this.validate();
    }

    isWeekSelected() {
        let week = Object.keys(DaysOfWeek);
        let weekSelector = week.join(',');

        return this.eventTime.daysOfWeek == weekSelector
    }
}
