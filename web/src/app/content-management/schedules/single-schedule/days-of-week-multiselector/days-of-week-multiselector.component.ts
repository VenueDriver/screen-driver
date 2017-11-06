import {Component, Input, EventEmitter, Output} from '@angular/core';
import {WeekDays} from "../../../../core/enums/days-of-week";


@Component({
    selector: 'days-of-week-multiselector',
    templateUrl: 'days-of-week-multiselector.component.html',
    styleUrls: ['days-of-week-multiselector.component.sass']
})
export class DaysOfWeekMultiselectorComponent {
    @Input() selectedDays;
    @Input() editMode = false;
    @Output() select = new EventEmitter();

    constructor() {
    }

    getDaysOfWeek(): Array<any> {
        let daysOfWeek = [];

        for (let dayOfWeek in WeekDays) {
            daysOfWeek.push({title: WeekDays[dayOfWeek].substring(0, 3), selected: this.isSelected(dayOfWeek)});
        }

        return daysOfWeek;
    }

    isSelected(dayOfWeek: string): boolean {
        return this.selectedDays && this.selectedDays.includes(dayOfWeek)
    }

    onSelectedDaysOfWeekChanged(daysOfWeek) {
        let selectedDays = daysOfWeek.filter(day => day.selected);
        selectedDays = selectedDays.map(day => day.title.toUpperCase());
        this.select.emit(selectedDays)
    }
}
