import {
    Component, OnInit, Input, Output, EventEmitter, Renderer2, OnDestroy
} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";
import {HeaderService} from "../../header/header.service";

import * as _ from 'lodash';

@Component({
    selector: 'settings-manager',
    templateUrl: 'settings-manager.component.html',
    styleUrls: ['settings-manager.component.sass']
})
export class SettingsManagerComponent implements OnInit, OnDestroy {

    @Input() settings: Setting[];
    @Output() settingSelected: EventEmitter<Setting> = new EventEmitter();

    activeSetting: Setting;
    showSidebar = true;
    sidebar;

    constructor(private headerService: HeaderService,
                private settingStateHolderService: SettingStateHolderService,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        if (this.settings) {
            this.activeSetting = this.settings[0];
        }
        this.subscribeOnSidebarToggle();
        this.subscribeOnCurrentSettingChange();
        this.sidebar = document.getElementById('sidebar');
    }

    ngOnDestroy() {
        this.enableScroll();
    }

    subscribeOnSidebarToggle() {
        this.headerService.getSideBarToggleSubscription()
            .subscribe(() => this.toggle());
    }

    subscribeOnCurrentSettingChange() {
        this.settingStateHolderService.getCurrentSetting()
            .subscribe(setting => this.activeSetting = setting);
    }

    toggle() {
        this.showSidebar = !this.showSidebar;
        this.toggleDocumentScroll();
        this.setClass();
    }

    private toggleDocumentScroll() {
        if (this.showSidebar) {
            this.disableScroll();
        } else {
            this.enableScroll();
        }
    }

    private disableScroll() {
        this.renderer.addClass(document.body, 'sidebar-open');
    }

    private enableScroll() {
        this.renderer.removeClass(document.body, 'sidebar-open');
    }

    private setClass() {
        if (!this.sidebar) {
            return;
        }
        if (window.pageYOffset > 30) {
            this.renderer.removeClass(this.sidebar, 'with-top-margin');
        } else {
            this.renderer.addClass(this.sidebar, 'with-top-margin');
        }
    }

    onSettingSelection(setting: Setting) {
        this.settingSelected.emit(setting);
        this.headerService.pushSidebarToggleEvent();
    }

    handleUpdateSettingResponse() {
        let currentSettingId = this.activeSetting ? this.activeSetting.id : '';
        this.settingStateHolderService.reloadSettings(currentSettingId);
        if (!this.activeSetting) {
            this.showCurrentState();
        }
    }

    showCurrentState() {
        this.settingStateHolderService.changeCurrentSetting();
        this.activeSetting = null;
        this.headerService.pushSidebarToggleEvent();
    }

    getEnabledSettingsCount(): number {
        let enabledSettings = _.filter(this.settings, 'enabled');
        return enabledSettings.length;
    }

    getPriorityTypes(): any[] {
        return this.settingStateHolderService.getPriorityTypes();
    }

    getSettingsForType(type) {
        return _.filter(this.settings, setting => setting.priority === type.id);
    }
}
