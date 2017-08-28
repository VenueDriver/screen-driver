import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingsService} from "../settings.service";
import {HeaderService} from "../../header/header.service";

@Component({
    selector: 'settings-group',
    templateUrl: './settings-group.component.html',
    styleUrls: ['./settings-group.component.sass']
})
export class SettingsGroupComponent {
    @Input() priorityType;
    @Input() settings: Array<Setting>;
    @Input() activeSetting: Setting;
    @Output() settingUpdate = new EventEmitter();
    @Output() settingSelect = new EventEmitter();

    constructor(private headerService: HeaderService,
                private settingsService: SettingsService) {
    }

    isActive(setting: Setting): boolean {
        return this.activeSetting && this.activeSetting.id === setting.id;
    }

    handleSettingUpdate() {
        this.settingUpdate.emit();
    }

    onSettingSelection(setting: Setting) {
        this.settingSelect.emit(setting);
    }

    enableCreationMode(type: Object) {
        this.settingsService.emitCreateSettingEvent(true, type);
        this.headerService.pushSidebarToggleEvent();
    }

    getPrefixColor() {
        return this.priorityType.name.toLowerCase();
    }
}
