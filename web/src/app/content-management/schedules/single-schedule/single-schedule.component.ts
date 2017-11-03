import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SchedulesService} from "../schedules.service";
import {Schedule} from "../models/schedule.model";
import {EventTime} from "../models/event-time";
import {SettingStateHolderService} from "../../../core/setting-state-manager/settings-state-holder.service";
import {Setting} from "../../../settings/entities/setting";
import {ValidationResult} from "../models/validation-result.model";
import {Periodicity} from '../../../core/enums/periodicity';
import {DaysOfWeek} from '../../../core/enums/days-of-week';

import * as _ from 'lodash';
import {PriorityTypes} from "../../../core/enums/priorty-types";

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

    timePeriods = ['AM', 'PM'];

    validationResult: ValidationResult = {isValid: true};

    scheduleTypes = Periodicity;

    constructor(
        private schedulesService: SchedulesService,
        private settingStateHolderService: SettingStateHolderService
    ) {
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

    changeTimePeriod(field) {
        if (this.eventTime[field] === this.timePeriods[0]) {
            this.setTime(field, this.timePeriods[1])
        } else {
            this.setTime(field, this.timePeriods[0]);
        }
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
        this.isAllWeekDaysSelected() ? this.unSelectAllWeekDays() : this.selectAllWeekDays();
    }

    selectAllWeekDays() {
       let allDays = Object.keys(DaysOfWeek);
       this.eventTime.daysOfWeek = allDays.join(',');

       this.validate();
    }

    unSelectAllWeekDays() {
        this.eventTime.daysOfWeek = "";

        this.validate();
    }

    isAllWeekDaysSelected() {
        let week = Object.keys(DaysOfWeek);
        let weekSelector = week.join(',');

        return this.eventTime.daysOfWeek == weekSelector
    }
}
