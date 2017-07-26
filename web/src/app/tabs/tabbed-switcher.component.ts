import {Component, OnInit, ContentChildren, QueryList} from '@angular/core';
import {SingleTabComponent} from "./tab/single-tab.component";

@Component({
    selector: 'tabbed-switcher',
    templateUrl: 'tabbed-switcher.component.html'
})
export class TabbedSwitcherComponent implements OnInit {

    @ContentChildren(SingleTabComponent) tabs: QueryList<SingleTabComponent>;

    constructor() { }

    ngOnInit() { }

    switchTab(tabIndex: number) {
        this.tabs.forEach((tab: SingleTabComponent, index) => {
            if (tab.show && index + 1 != tabIndex) {
                tab.show = false;
            }
            if (index + 1 == tabIndex) {
                tab.show = true;
            }
        })
    }
}