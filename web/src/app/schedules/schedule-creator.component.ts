import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'schedule-creator',
    templateUrl: 'schedule-creator.component.html'
})
export class ScheduleCreatorComponent implements OnInit {

    date = new Date();

    constructor() { }

    ngOnInit() { }

}