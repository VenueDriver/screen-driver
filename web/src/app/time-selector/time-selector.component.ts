import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'time-selector',
    templateUrl: './time-selector.component.html',
    styleUrls: ['./time-selector.component.sass']
})
export class TimeSelectorComponent implements OnInit {
    @Input() label: string;
    @Input() defaultTime: string = '12:00';
    @Input() defaultTimePeriod: string = 'AM';
    @Input() disabled: boolean = false;

    @Output() timeChange = new EventEmitter();
    @Output() timePeriodChange = new EventEmitter();

    timePeriods = ['AM', 'PM'];
    timeItems: Array<string> = [];
    time: string;

    constructor() {
        this.generateTimeItems();
    }

    ngOnInit() {
    }

    generateTimeItems() {
        this.timeItems.push(`${12}:00`, `${12}:15`, `${12}:30`, `${12}:45`);
        for (let i = 1; i < 12; i++) {
            this.timeItems.push(`${i}:00`, `${i}:15`, `${i}:30`, `${i}:45`);
        }
    }

    changeTimePeriod($event) {
        if (this.disabled) return;

        if (this.defaultTimePeriod === this.timePeriods[0]) {
            this.timePeriodChange.emit(this.timePeriods[1])
        } else {
            this.timePeriodChange.emit(this.timePeriods[0]);
        }
        $event.stopPropagation();
    }

    setTime(time: string) {
        this.timeChange.emit(time);
        event.stopPropagation();
    }
}
