import {Component, OnInit, ContentChildren, QueryList, Input, AfterViewInit, NgZone} from '@angular/core';
import {SingleTabComponent} from "./single-tab/single-tab.component";

@Component({
    selector: 'tabbed-switcher',
    templateUrl: 'tabbed-switcher.component.html',
    styleUrls: ['tabbed-switcher.component.sass']
})
export class TabbedSwitcherComponent implements OnInit, AfterViewInit {

    @ContentChildren(SingleTabComponent) tabs: QueryList<SingleTabComponent>;

    @Input() tabTitles: Array<string>;

    activeTabIndex = 0;

    constructor(private zone : NgZone) { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.zone.onMicrotaskEmpty.subscribe(() => {
            if (this.activeTabIndex == 0) {
                this.tabs.first.show = true;
            }
        });
    }

    switchTab(tabIndex: number) {
        this.tabs.forEach((tab: SingleTabComponent, index) => {
            if (tab.show && index != tabIndex) {
                tab.show = false;
            }
            if (index == tabIndex) {
                tab.show = true;
                this.activeTabIndex = index;
            }
        })
    }

    isTabActive(tabIndex: number): boolean {
        return this.activeTabIndex == tabIndex;
    }
}