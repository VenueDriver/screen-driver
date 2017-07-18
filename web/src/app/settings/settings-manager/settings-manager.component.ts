import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";
import {HeaderService} from "../../header/header.service";
import {SettingsService} from "../settings.service";
import {NotificationService} from "../../notifications/notification.service";

@Component({
    selector: 'settings-manager',
    templateUrl: 'settings-manager.component.html',
    styleUrls: ['settings-manager.component.sass']
})
export class SettingsManagerComponent implements OnInit {

    @Input() configs: Setting[];
    @Output() configSelected: EventEmitter<Setting> = new EventEmitter();

    activeConfig: Setting;
    creationMode = false;
    showSidebar = true;

    constructor(private headerService: HeaderService,
                private configStateHolderService: SettingStateHolderService,
                private configService: SettingsService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        if (this.configs) {
            this.activeConfig = this.configs[0];
        }
        this.subscribeOnSidebarToggle();
    }

    subscribeOnSidebarToggle() {
        this.headerService.getSideBarToggleSubscription()
            .subscribe(() => this.toggle());
    }

    toggle() {
        this.showSidebar = !this.showSidebar;
    }

    onConfigSelected(config: Setting) {
        this.configSelected.emit(config);
        this.activeConfig = config;
        this.headerService.pushSidebarToggleEvent();
    }

    isActive(config: Setting): boolean {
        return this.activeConfig && this.activeConfig.id === config.id;
    }

    handleConfigCreation() {
        this.configStateHolderService.reloadConfigs();
        this.disableCreationMode();
    }

    enableCreationMode() {
        this.creationMode = true;
    }

    disableCreationMode() {
        this.creationMode = false;
    }

    onToggleClick(event: any) {
        event.stopPropagation();
    }

    changeConfigState(config: Setting, state: boolean) {
        config.enabled = state;
        this.configService.updateConfiguration(config)
            .subscribe(
                response => this.configStateHolderService.reloadConfigs(),
                error => this.notificationService.showErrorNotificationBar('Unable to change setting state')
            );
    }

    showCurrentState() {
        this.configStateHolderService.changeCurrentConfig();
        this.activeConfig = null;
    }

    isAnyActive(): boolean {
        return !!this.activeConfig;
    }
}
