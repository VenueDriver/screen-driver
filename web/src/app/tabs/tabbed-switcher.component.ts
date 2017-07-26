import {Component, OnInit, ViewChildren, ContentChildren, QueryList, AfterViewInit} from '@angular/core';
import {SingleTabComponent} from "./tab/single-tab.component";

@Component({
    selector: 'tabbed-switcher',
    templateUrl: 'tabbed-switcher.component.html'
})
export class TabbedSwitcherComponent implements OnInit, AfterViewInit {

    @ContentChildren(SingleTabComponent) tabs: QueryList<SingleTabComponent>;

    constructor() { }

    ngOnInit() { }

    ngAfterViewInit() {

    }
}