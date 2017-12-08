import {Component, ContentChildren, QueryList, Input, AfterViewInit, NgZone} from '@angular/core';
import {SingleTabComponent} from "./single-tab/single-tab.component";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'tabbed-switcher',
    templateUrl: 'tabbed-switcher.component.html',
    styleUrls: ['tabbed-switcher.component.sass']
})
export class TabbedSwitcherComponent implements AfterViewInit {

    @ContentChildren(SingleTabComponent) tabs: QueryList<SingleTabComponent>;

    activeTabIndex = 0;

    constructor(private zone: NgZone) { }

    ngAfterViewInit() {
        this.zone.onMicrotaskEmpty.subscribe(() => this.activateFirstTab());
        let observables = [];
        this.tabs.forEach(tab => observables.push(tab.changed.asObservable()));
        Observable.merge(...observables)
            .subscribe(() => this.handleTabStateChanges());
    }

    activateFirstTab() {
        if (this.activeTabIndex == 0) {
            this.tabs.first.active = true;
        }
    }

    switchTab(tabIndex: number) {
        this.tabs.forEach((tab: SingleTabComponent, index) => {
            if (tab.disabled) return;
            if (tab.active && index != tabIndex) {
                tab.active = false;
            }
            if (index == tabIndex) {
                tab.active = true;
                this.activeTabIndex = index;
            }
        })
    }

    isTabActive(tabIndex: number): boolean {
        return this.activeTabIndex == tabIndex;
    }

    handleTabStateChanges() {
        let activeTab = this.tabs.find(tab => tab.active);
        if (!activeTab) {
            this.tabs.forEach((tab: SingleTabComponent, index) => {
                if (!tab.disabled && !tab.active && this.activeTabIndex !== 0) {
                    tab.active = true;
                    this.activeTabIndex = index;
                    return;
                }
            });
        }
    }
}
