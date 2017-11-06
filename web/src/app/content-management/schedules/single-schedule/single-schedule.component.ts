import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SchedulesService} from "../schedules.service";
import {Schedule} from "../models/schedule.model";
import {EventTime} from "../models/event-time.model";
import {SettingStateHolderService} from "../../../core/setting-state-manager/settings-state-holder.service";
import {Setting} from "../../../settings/entities/setting";
import {ValidationResult} from "../models/validation-result.model";
import {Periodicity} from '../../../core/enums/periodicity';
import {WeekDays} from '../../../core/enums/days-of-week';

import * as _ from 'lodash';
import {PriorityTypes} from "../../../core/enums/priorty-types";
import {EventTimeValidator} from "../event-time/event-time.validator";
import {EventTimeHolder} from "../event-time/event-time.holder";

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
    eventTimeHolder: EventTimeHolder;

    validationResult: ValidationResult = {isValid: true};

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
            .subscribe(() => this.eventTimeHolder = EventTimeHolder.init());
    }

    setEventTimeProperties() {
        if (!_.isEmpty(this.schedule)) {
            this.eventTimeHolder.setProperties(this.schedule);
            this.eventTimeHolder.saveCopyOfPropertiesState();
        }
    }

    setTime(field: string, time: string) {
        this.eventTimeHolder.setTime(field, time);
        this.validate();
    }

    validate() {
        this.validationResult = EventTimeValidator.validate(this.eventTimeHolder.value());
    }

    performCreatingSubmit() {
        this.schedulesService.createSchedule(this.currentSetting, this.eventTimeHolder);
    }

    onStartDateSelect() {
        this.eventTimeHolder.setEndDateEqualToStartDate();
        this.validate();
    }

    onEndDateSelect() {
        this.eventTimeHolder.setStartDateToZeroIfItLargerThenEndDate();
        this.validate();
    }

    isCreationMode(): boolean {
        return _.isEmpty(this.schedule);
    }

    isEditMode(): boolean {
        return !this.isCreationMode()
            && !this.removingMode
            && !this.eventTimeHolder.isCopyEqualToSource();
    }

    performUpdatingSubmit() {
        this.schedulesService.updateSchedule(this.schedule, this.eventTimeHolder);
    }

    performCancel() {
        if (this.isCreationMode()) {
            this.cancel.emit();
        } else {
            this.eventTimeHolder.restorePropertiesState();
            this.validationResult = {isValid: true};
        }
    }

    setScheduleType(scheduleType?: string) {
        this.eventTimeHolder.setPeriodicity(scheduleType);
        this.validate();
    }

    setDaysOfWeek(daysOfWeek: Array<string>) {
        this.eventTimeHolder.setWeekDays(daysOfWeek.join(','));
        this.validate();
    }

    changeScheduleState(state: boolean) {
        this.schedule.enabled = state;
        this.schedulesService.updateSchedule(this.schedule);
    }

    changeTimePeriod(field) {
        this.eventTimeHolder.changeTimePeriod(field);
    }

    setRemovingMode(boolean: boolean) {
        this.removingMode = boolean;
    }

    removeSchedule() {
        this.schedulesService.removeSchedule(this.schedule);
    }

    getDaysOfWeek(): Array<string> {
        return this.eventTimeHolder.getWeekDaysArray();
    }

    toggleWeek() {
        this.isAllWeekDaysSelected() ? this.unSelectAllWeekDays() : this.selectAllWeekDays();
    }

    selectAllWeekDays() {
       let allDays = Object.keys(WeekDays);
       this.eventTimeHolder.setWeekDays(allDays.join(','));

       this.validate();
    }

    unSelectAllWeekDays() {
        this.eventTimeHolder.setWeekDays("");

        this.validate();
    }

    isAllWeekDaysSelected() {
        let allDays = Object.keys(WeekDays);
        let weekSelector = allDays.join(',');

        return this.eventTimeHolder.getWeekDays() == weekSelector
    }
}
