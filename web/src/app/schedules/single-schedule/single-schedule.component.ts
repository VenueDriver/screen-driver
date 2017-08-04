import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SchedulesService} from "../schedules.service";
import {Schedule} from "../entities/schedule";
import {EventTime} from "../entities/event-time";
import {SettingStateHolderService} from "../../settings/setting-state-manager/settings-state-holder.service";
import {Setting} from "../../settings/entities/setting";
import {ValidationResult} from "../entities/validation-result";
import {ScheduleTypes} from '../../enums/schedule-types';
import {DaysOfWeek} from '../../enums/days-of-week';

import * as _ from 'lodash';

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

    eventTime = new EventTime();
    originalEventTime: EventTime;

    timeItems: Array<string> = [];
    timePeriods = ['AM', 'PM'];

    validationResult: ValidationResult = {isValid: true};

    scheduleTypes = ScheduleTypes;

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
    }

    generateTimeItems() {
        for (let i = 1; i <= 12; i++) {
            this.timeItems.push(`${i}:00`, `${i}:15`, `${i}:30`, `${i}:45`);
        }
    }

    subscribeToCurrentSettingUpdate() {
        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => this.currentSetting = setting);
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
        return !this.isCreationMode() && !_.isEqual(this.eventTime, this.originalEventTime);
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

    setScheduleType(scheduleType: string) {
        this.eventTime.scheduleType = scheduleType;
        this.validate();
    }

    setDayOfWeek(dayOfWeek: string) {
        this.eventTime.dayOfWeek = dayOfWeek;
    }
}