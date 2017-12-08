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
        this.subscribeOnChangesInTabs();
    }

    subscribeOnChangesInTabs() {
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
            if (index == tabIndex) this.activateTab(tab, index);
            if (tab.active && tabIndex != index) tab.active = false;
        })
    }

    private activateTab(tab: SingleTabComponent, index) {
        tab.active = true;
        this.activeTabIndex = index;
    }

    isTabActive(tabIndex: number): boolean {
        return this.activeTabIndex == tabIndex;
    }

    handleTabStateChanges() {
        let activeTab = this.tabs.find(tab => tab.active);
        if (!activeTab) {
            this.activateFirstEnabledTab();
        }
    }

    private activateFirstEnabledTab() {
        this.tabs.forEach((tab: SingleTabComponent, index) => {
            if (!tab.disabled && !tab.active && this.activeTabIndex !== 0) {
                this.activateTab(tab, index);
                return;
            }
        });
    }
}
