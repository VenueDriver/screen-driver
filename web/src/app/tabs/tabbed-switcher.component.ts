import {Component, OnInit, ContentChildren, QueryList, Input} from '@angular/core';
import {SingleTabComponent} from "./tab/single-tab.component";

@Component({
    selector: 'tabbed-switcher',
    templateUrl: 'tabbed-switcher.component.html'
})
export class TabbedSwitcherComponent implements OnInit {

    @ContentChildren(SingleTabComponent) tabs: QueryList<SingleTabComponent>;

    @Input() tabTitles: Array<string>;

    constructor() { }

    ngOnInit() { }

    switchTab(tabIndex: number) {
        this.tabs.forEach((tab: SingleTabComponent, index) => {
            if (tab.show && index != tabIndex) {
                tab.show = false;
            }
            if (index == tabIndex) {
                tab.show = true;
            }
        })
    }
}